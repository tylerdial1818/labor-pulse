import { ELOUNDOU_OCC_LEVEL_URL } from "../src/lib/ai-impact/eloundou";
import { INSIGHT_SOURCES } from "../src/lib/insights/sources";
import { indicatorCatalog } from "../src/lib/indicators/catalog";

type LinkTarget = {
  label: string;
  url: string;
  allowStatuses?: number[];
};

const targets: LinkTarget[] = [
  ...indicatorCatalog.map((indicator) => ({
    label: `Indicator: ${indicator.id}`,
    url: indicator.sourceUrl
  })),
  ...INSIGHT_SOURCES.map((source) => ({
    label: `Insight source: ${source.name}`,
    url: source.url,
    allowStatuses: source.url.includes("bls.gov") ? [200, 403] : [200]
  })),
  {
    label: "Eloundou occupation exposure CSV",
    url: ELOUNDOU_OCC_LEVEL_URL
  },
  {
    label: "Eloundou paper",
    url: "https://arxiv.org/abs/2303.10130"
  },
  {
    label: "OpenAI GPTs are GPTs repository",
    url: "https://github.com/openai/GPTs-are-GPTs"
  }
];

async function checkTarget(target: LinkTarget) {
  const allowStatuses = target.allowStatuses ?? [200];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    let response = await fetch(target.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "user-agent": "LaborPulse/1.0 source-link-check" }
    });

    if ([403, 405].includes(response.status) && !allowStatuses.includes(response.status)) {
      response = await fetch(target.url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "LaborPulse/1.0 source-link-check" }
      });
    }

    return {
      ...target,
      status: response.status,
      finalUrl: response.url,
      ok: allowStatuses.includes(response.status)
    };
  } catch (error) {
    return {
      ...target,
      status: 0,
      finalUrl: target.url,
      ok: false,
      message: error instanceof Error ? error.message : "Unknown link check error"
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const uniqueTargets = Array.from(new Map(targets.map((target) => [target.url, target])).values());
  const results = await Promise.all(uniqueTargets.map(checkTarget));

  for (const result of results) {
    const marker = result.ok ? "ok" : "bad";
    console.log(`${marker} ${result.status} ${result.label} -> ${result.finalUrl}`);
    if ("message" in result && result.message) {
      console.log(`  ${result.message}`);
    }
  }

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    throw new Error(`${failed.length} source link${failed.length === 1 ? "" : "s"} failed.`);
  }
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
