"use client";

import { useState } from "react";
import { previewImport, confirmImport } from "../../app/import/actions";
import type { CsvPreview } from "../../lib/import/csv";

export default function ImportForm() {
  const [status, setStatus] = useState<"idle" | "previewing" | "confirming">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handlePreview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      setError("Please attach a CSV file.");
      return;
    }

    try {
      setStatus("previewing");
      const result = await previewImport(formData);
      setPreview(result.preview);
      setJobId(result.jobId);
      setStatus("idle");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Preview failed.");
    }
  };

  const handleConfirm = async () => {
    if (!preview || !jobId) return;

    try {
      setStatus("confirming");
      const formData = new FormData();
      formData.set("job_id", jobId);
      formData.set("rows", JSON.stringify(preview.validRows));
      await confirmImport(formData);
      setStatus("idle");
      setPreview(null);
      setJobId(null);
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Import failed.");
    }
  };

  return (
    <div className="grid gap-6">
      <form
        className="grid gap-4 rounded-3xl border border-ink-800/10 bg-white p-5"
        onSubmit={handlePreview}
      >
        <div>
          <p className="text-sm font-semibold">Upload CSV</p>
          <p className="text-xs text-ink-800/70">
            Preview rows before importing. Invalid rows will be skipped.
          </p>
        </div>

        <input
          className="rounded-xl border border-ink-800/20 bg-white px-3 py-2 text-sm"
          type="file"
          name="file"
          accept=".csv,text/csv"
          required
        />

        {error ? <p className="text-xs text-rose-600">{error}</p> : null}

        <button
          className="rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={status !== "idle"}
        >
          {status === "previewing" ? "Previewing..." : "Preview import"}
        </button>
      </form>

      {preview ? (
        <section className="grid gap-4">
          <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                Valid rows: <strong>{preview.validRows.length}</strong>
              </span>
              <span>
                Invalid rows: <strong>{preview.invalidRows.length}</strong>
              </span>
            </div>
          </div>

          {preview.invalidRows.length ? (
            <div className="rounded-2xl border border-ink-800/10 bg-white p-4 text-sm">
              <p className="mb-2 font-semibold">Invalid rows</p>
              <div className="max-h-48 overflow-auto text-xs text-ink-800/70">
                {preview.invalidRows.map((row) => (
                  <div key={`${row.row}-${row.message}`}>
                    Row {row.row}: {row.message}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {preview.validRows.length ? (
            <button
              className="rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50 disabled:cursor-not-allowed disabled:opacity-70"
              type="button"
              onClick={handleConfirm}
              disabled={status === "confirming"}
            >
              {status === "confirming" ? "Importing..." : "Confirm import"}
            </button>
          ) : (
            <div className="text-sm text-ink-800">
              No valid rows to import. Fix the CSV and try again.
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
