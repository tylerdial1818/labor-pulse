import type { AiExposureScore } from "@/types/v15";

export const ELOUNDOU_OCC_LEVEL_URL = "https://raw.githubusercontent.com/openai/GPTs-are-GPTs/main/data/occ_level.csv";

export const ELOUNDOU_METHODOLOGY_NOTE =
  "Exposure scores come from Eloundou, Manning, Mishkin, and Rock's GPTs are GPTs occupation-level data. Labor Pulse uses dv_rating_beta by default, interpreted as potential task exposure to LLMs plus partial complementary software support. This is exposure potential, not realized adoption, displacement, layoffs, or net job creation.";

type EloundouRow = {
  occupationSocCode: string;
  occupationTitle: string;
  dvRatingBeta: number;
};

function parseCsvLine(line: string) {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === "\"" && nextCharacter === "\"") {
      current += "\"";
      index += 1;
    } else if (character === "\"") {
      inQuotes = !inQuotes;
    } else if (character === "," && !inQuotes) {
      values.push(current);
      current = "";
    } else {
      current += character;
    }
  }

  values.push(current);
  return values.map((value) => value.trim());
}

function exposureCategory(score: number): AiExposureScore["exposureCategory"] {
  if (score >= 0.66) return "high";
  if (score >= 0.33) return "moderate";
  return "low";
}

export function parseEloundouOccupationCsv(contents: string): AiExposureScore[] {
  const [headerLine, ...lines] = contents.trim().split(/\r?\n/);

  if (!headerLine) {
    throw new Error("Eloundou occupation CSV is empty.");
  }

  const headers = parseCsvLine(headerLine);
  const codeIndex = headers.indexOf("O*NET-SOC Code");
  const titleIndex = headers.indexOf("Title");
  const betaIndex = headers.indexOf("dv_rating_beta");

  if (codeIndex === -1 || titleIndex === -1 || betaIndex === -1) {
    throw new Error("Eloundou occupation CSV requires O*NET-SOC Code, Title, and dv_rating_beta columns.");
  }

  return lines.filter(Boolean).map((line, index) => {
    const values = parseCsvLine(line);
    const row: EloundouRow = {
      occupationSocCode: values[codeIndex],
      occupationTitle: values[titleIndex],
      dvRatingBeta: Number(values[betaIndex])
    };

    if (!row.occupationSocCode || !row.occupationTitle) {
      throw new Error(`Invalid occupation identity at Eloundou CSV row ${index + 2}.`);
    }

    if (!Number.isFinite(row.dvRatingBeta) || row.dvRatingBeta < 0 || row.dvRatingBeta > 1) {
      throw new Error(`Invalid dv_rating_beta at Eloundou CSV row ${index + 2}.`);
    }

    return {
      occupationSocCode: row.occupationSocCode,
      occupationTitle: row.occupationTitle,
      exposureScore: Number(row.dvRatingBeta.toFixed(4)),
      exposureCategory: exposureCategory(row.dvRatingBeta)
    };
  });
}

export async function fetchEloundouOccupationScores(url = ELOUNDOU_OCC_LEVEL_URL) {
  const response = await fetch(url, {
    headers: { accept: "text/csv,text/plain" },
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Eloundou occupation data with status ${response.status}.`);
  }

  return parseEloundouOccupationCsv(await response.text());
}
