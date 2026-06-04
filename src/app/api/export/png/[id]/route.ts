import { PNG } from "pngjs";
import { NextResponse } from "next/server";

import { getIndicatorDetail, trailingHistoryWindow } from "@/lib/db/queries";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ink = [28, 24, 21, 255] as const;
const sub = [107, 98, 88, 255] as const;
const navy = [36, 68, 107, 255] as const;
const rule = [218, 214, 207, 255] as const;
const paper = [251, 250, 246, 255] as const;

const font: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10011", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "/": ["00001", "00001", "00010", "00100", "01000", "10000", "10000"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  ":": ["00000", "01100", "01100", "00000", "01100", "01100", "00000"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"]
};

function setPixel(png: PNG, x: number, y: number, color: readonly number[]) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) return;
  const index = (png.width * y + x) << 2;
  png.data[index] = color[0] ?? 0;
  png.data[index + 1] = color[1] ?? 0;
  png.data[index + 2] = color[2] ?? 0;
  png.data[index + 3] = color[3] ?? 255;
}

function drawRect(png: PNG, x: number, y: number, width: number, height: number, color: readonly number[]) {
  for (let yy = y; yy < y + height; yy += 1) {
    for (let xx = x; xx < x + width; xx += 1) setPixel(png, xx, yy, color);
  }
}

function drawLine(png: PNG, x0: number, y0: number, x1: number, y1: number, color: readonly number[], thickness = 2) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let error = dx + dy;
  let x = x0;
  let y = y0;

  while (true) {
    drawRect(png, x, y, thickness, thickness, color);
    if (x === x1 && y === y1) break;
    const e2 = 2 * error;
    if (e2 >= dy) {
      error += dy;
      x += sx;
    }
    if (e2 <= dx) {
      error += dx;
      y += sy;
    }
  }
}

function drawText(png: PNG, text: string, x: number, y: number, scale: number, color: readonly number[]) {
  let cursor = x;
  for (const character of text.toUpperCase()) {
    const glyph = font[character] ?? font[" "];
    glyph.forEach((row, rowIndex) => {
      [...row].forEach((bit, columnIndex) => {
        if (bit === "1") drawRect(png, cursor + columnIndex * scale, y + rowIndex * scale, scale, scale, color);
      });
    });
    cursor += 6 * scale;
  }
}

function formatAxisValue(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  if (absolute >= 100) return value.toFixed(0);
  if (absolute >= 10) return value.toFixed(1);

  return value.toFixed(2).replace(/\.?0+$/, "");
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const detail = await getIndicatorDetail(id);

  if (!detail) {
    return NextResponse.json({ error: "Indicator not found" }, { status: 404 });
  }

  const observations = trailingHistoryWindow(
    detail.observations.filter((observation): observation is { seriesId: string; geography: string; date: string; value: number } => observation.value !== null)
  );
  const png = new PNG({ width: 1040, height: 420 });
  drawRect(png, 0, 0, png.width, png.height, paper);

  drawText(png, detail.series.shortTitle.slice(0, 44), 70, 52, 4, ink);
  drawText(png, `${observations[0]?.date ?? "NA"} TO ${observations.at(-1)?.date ?? "NA"}  SOURCE: ${detail.series.source}`.slice(0, 78), 70, 96, 2, sub);
  drawText(png, `UNITS: ${detail.series.units}`.slice(0, 78), 70, 390, 2, sub);
  drawText(png, "EXPORTED FROM LABOR PULSE", 700, 372, 2, sub);

  if (observations.length > 1) {
    const plot = { left: 170, right: 970, top: 150, bottom: 330 };
    const min = Math.min(...observations.map((point) => point.value));
    const max = Math.max(...observations.map((point) => point.value));
    const range = max - min || 1;
    const midpoint = min + (max - min) / 2;
    const yTicks = [
      { label: formatAxisValue(max), y: plot.top },
      { label: formatAxisValue(midpoint), y: plot.top + Math.round((plot.bottom - plot.top) / 2) },
      { label: formatAxisValue(min), y: plot.bottom }
    ];

    drawText(png, `VALUE ${detail.series.units}`.slice(0, 16), 70, 126, 2, sub);
    for (const tick of yTicks) {
      drawLine(png, plot.left, tick.y, plot.right, tick.y, rule, 1);
      drawText(png, tick.label.slice(0, 7), 88, tick.y - 7, 2, sub);
    }
    drawLine(png, plot.left, plot.top, plot.left, plot.bottom, rule, 1);
    drawLine(png, plot.left, plot.bottom, plot.right, plot.bottom, rule, 1);

    const coords = observations.map((point, index) => ({
      x: Math.round(plot.left + (index / Math.max(observations.length - 1, 1)) * (plot.right - plot.left)),
      y: Math.round(plot.bottom - ((point.value - min) / range) * (plot.bottom - plot.top))
    }));

    for (let index = 1; index < coords.length; index += 1) {
      const previous = coords[index - 1];
      const current = coords[index];
      if (previous && current) drawLine(png, previous.x, previous.y, current.x, current.y, navy, 4);
    }

    drawText(png, observations[0]?.date ?? "NA", plot.left, 346, 2, sub);
    drawText(png, observations.at(-1)?.date ?? "NA", plot.right - 120, 346, 2, sub);
    drawText(png, "OBSERVATION DATE", 430, 372, 2, sub);
  } else {
    drawText(png, "VALUE", 70, 126, 2, sub);
    drawText(png, "OBSERVATION DATE", 430, 372, 2, sub);
  }

  return new Response(new Uint8Array(PNG.sync.write(png)), {
    headers: {
      "content-type": "image/png",
      "content-disposition": `attachment; filename="${detail.series.id.toLowerCase()}-chart.png"`
    }
  });
}
