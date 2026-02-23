"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth/session";
import { parseCsv, type CsvPreview } from "../../lib/import/csv";
import { upsertDailyCheckin } from "../../lib/db/checkins";
import { upsertRecoveryScore } from "../../lib/db/scores";
import {
  createImportJob,
  updateImportJob
} from "../../lib/db/imports";
import {
  type DailyCheckinInput,
  recomputeScoresForImport
} from "../../lib/scoring/v1";

const readCsvFile = async (file: File) => {
  const text = await file.text();
  if (!text.trim()) {
    throw new Error("CSV file is empty.");
  }
  return text;
};

export async function previewImport(formData: FormData) {
  const userId = await requireUserId();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    throw new Error("Please attach a CSV file.");
  }

  const text = await readCsvFile(file);
  const preview = parseCsv(text);

  const job = await createImportJob({
    userId,
    originalFilename: file.name || "import.csv",
    status: "previewed",
    rowErrors: preview.invalidRows.length ? preview.invalidRows : null
  });

  return {
    jobId: job.id,
    preview
  } satisfies { jobId: string; preview: CsvPreview };
}

export async function confirmImport(formData: FormData) {
  const userId = await requireUserId();
  const jobId = String(formData.get("job_id") ?? "");
  const rowsJson = String(formData.get("rows") ?? "");

  if (!jobId) {
    throw new Error("Import job id missing.");
  }
  if (!rowsJson) {
    throw new Error("No rows provided for import.");
  }

  let rows: unknown;
  try {
    rows = JSON.parse(rowsJson) as unknown;
  } catch {
    throw new Error("Import rows were invalid.");
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No valid rows to import.");
  }

  const inputs = rows.filter(
    (row): row is DailyCheckinInput =>
      typeof row === "object" && row !== null && "date" in row
  );

  if (!inputs.length) {
    throw new Error("No valid rows to import.");
  }

  const scored = recomputeScoresForImport(inputs);
  const inputByDate = new Map(inputs.map((input) => [input.date, input]));

  for (const entry of scored) {
    const input = inputByDate.get(entry.date);
    if (!input) continue;
    await upsertDailyCheckin(userId, input);
    await upsertRecoveryScore(userId, entry.date, entry.score);
  }

  await updateImportJob({
    userId,
    id: jobId,
    status: "processed",
    rowErrors: null
  });

  revalidatePath("/today");
  revalidatePath("/trends");
  revalidatePath("/checkin");
}
