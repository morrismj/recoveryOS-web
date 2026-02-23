import type { DailyCheckinInput } from "../scoring/v1";

export type CsvRowError = {
  row: number;
  message: string;
};

export type CsvPreview = {
  validRows: DailyCheckinInput[];
  invalidRows: CsvRowError[];
};

const requiredHeaders = [
  "date",
  "sleep_hours",
  "stress",
  "soreness",
  "training_load",
  "alcohol",
  "energy"
];

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function parseCsv(text: string): CsvPreview {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length === 0) {
    return { validRows: [], invalidRows: [{ row: 0, message: "Empty CSV" }] };
  }

  const header = lines[0].split(",").map((cell) => cell.trim());
  const missing = requiredHeaders.filter((name) => !header.includes(name));
  if (missing.length) {
    return {
      validRows: [],
      invalidRows: [{ row: 0, message: `Missing headers: ${missing.join(", ")}` }]
    };
  }

  const headerIndex = Object.fromEntries(header.map((name, idx) => [name, idx]));
  const validRows: DailyCheckinInput[] = [];
  const invalidRows: CsvRowError[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const rowNumber = i + 1;
    const values = lines[i].split(",").map((cell) => cell.trim());

    const row: DailyCheckinInput = {
      date: values[headerIndex.date] ?? "",
      sleep_hours: parseNumber(values[headerIndex.sleep_hours] ?? "") ?? -1,
      stress: parseNumber(values[headerIndex.stress] ?? "") ?? -1,
      soreness: parseNumber(values[headerIndex.soreness] ?? "") ?? -1,
      training_load: (values[headerIndex.training_load] ?? "none") as
        | "none"
        | "light"
        | "medium"
        | "hard",
      alcohol: (values[headerIndex.alcohol] ?? "none") as "none" | "1-2" | "3+",
      energy: parseNumber(values[headerIndex.energy] ?? "") ?? -1,
      resting_hr: parseNumber(values[headerIndex.resting_hr] ?? "") ?? null,
      hrv: parseNumber(values[headerIndex.hrv] ?? "") ?? null,
      notes: values[headerIndex.notes] ?? null
    };

    const errors: string[] = [];
    if (!row.date) errors.push("date is required");
    if (row.sleep_hours < 0) errors.push("sleep_hours must be >= 0");
    if (row.stress < 1 || row.stress > 5) errors.push("stress must be 1-5");
    if (row.soreness < 1 || row.soreness > 5) errors.push("soreness must be 1-5");
    if (row.energy < 1 || row.energy > 5) errors.push("energy must be 1-5");

    if (errors.length) {
      invalidRows.push({ row: rowNumber, message: errors.join("; ") });
    } else {
      validRows.push(row);
    }
  }

  return { validRows, invalidRows };
}
