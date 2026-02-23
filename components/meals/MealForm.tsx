"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { compressImage } from "../../lib/media/compress";
import { createMeal } from "../../app/meals/actions";

const mealTypes = [
  { label: "Breakfast", value: "breakfast" },
  { label: "Lunch", value: "lunch" },
  { label: "Dinner", value: "dinner" },
  { label: "Snack", value: "snack" }
] as const;

const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

export default function MealForm() {
  const router = useRouter();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "compressing" | "saving">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const defaultTimestamp = useMemo(() => getLocalDateTime(), [formKey]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] ?? null;
    setError(null);
    setPhotoFile(file);
    setCompressedFile(null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);

    if (!file) return;

    try {
      setStatus("compressing");
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82
      });
      setCompressedFile(compressed);
      setStatus("idle");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Unable to compress image."
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const fileToUse = compressedFile ?? photoFile;
    if (!fileToUse) {
      setError("Please attach a meal photo.");
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("photo", fileToUse);

    try {
      setStatus("saving");
      await createMeal(formData);
      setStatus("idle");
      setPhotoFile(null);
      setCompressedFile(null);
      setPreviewUrl(null);
      setFormKey((key) => key + 1);
      router.refresh();
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Unable to save meal.");
    }
  };

  return (
    <form
      key={formKey}
      className="grid gap-4 rounded-3xl border border-ink-800/10 bg-white p-5"
      onSubmit={handleSubmit}
    >
      <div>
        <p className="text-sm font-semibold">Add a meal</p>
        <p className="text-xs text-ink-800/70">
          Photos stay private and help connect nutrition to recovery.
        </p>
      </div>

      <label className="flex flex-col gap-2 text-sm">
        Meal time
        <input
          className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
          type="datetime-local"
          name="timestamp"
          defaultValue={defaultTimestamp}
          required
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Meal type (optional)
        <select
          className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
          name="meal_type"
          defaultValue=""
        >
          <option value="">Select</option>
          {mealTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Tags (optional)
        <input
          className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
          name="tags"
          placeholder="protein, late-night, high-carb"
          type="text"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Notes (optional)
        <textarea
          className="min-h-[80px] rounded-xl border border-ink-800/20 bg-white px-3 py-2"
          name="note"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm">
        Meal photo
        <input
          className="rounded-xl border border-ink-800/20 bg-white px-3 py-2"
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
      </label>

      {previewUrl ? (
        <div className="overflow-hidden rounded-2xl border border-ink-800/10">
          <img
            alt="Meal preview"
            className="h-48 w-full object-cover"
            src={previewUrl}
          />
        </div>
      ) : null}

      {status === "compressing" ? (
        <p className="text-xs text-ink-800/70">Optimizing photo...</p>
      ) : null}

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}

      <button
        className="rounded-xl bg-ink-950 px-4 py-3 text-sm text-fog-50 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={status === "saving" || status === "compressing"}
      >
        {status === "saving" ? "Saving..." : "Save meal"}
      </button>
    </form>
  );
}
