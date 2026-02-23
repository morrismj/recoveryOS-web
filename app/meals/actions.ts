"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "../../lib/auth/session";
import {
  createMeal as persistMeal,
  deleteMeal as removeMeal
} from "../../lib/db/meals";

const toDataUrl = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const mimeType = file.type || "image/jpeg";
  return `data:${mimeType};base64,${base64}`;
};

const parseTags = (raw: string | null) => {
  if (!raw) return [];
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

export async function createMeal(formData: FormData) {
  const userId = await requireUserId();

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) {
    throw new Error("Please attach a meal photo.");
  }
  if (file.type && !file.type.startsWith("image/")) {
    throw new Error("Please upload an image file.");
  }

  const timestampRaw = String(formData.get("timestamp") ?? "");
  const timestamp = timestampRaw ? new Date(timestampRaw) : new Date();

  const mealTypeRaw = String(formData.get("meal_type") ?? "");
  const mealType =
    mealTypeRaw === "breakfast" ||
    mealTypeRaw === "lunch" ||
    mealTypeRaw === "dinner" ||
    mealTypeRaw === "snack"
      ? mealTypeRaw
      : null;

  const tags = parseTags(String(formData.get("tags") ?? ""));
  const noteRaw = String(formData.get("note") ?? "").trim();

  const photoUrl = await toDataUrl(file);

  await persistMeal(userId, {
    timestamp,
    photoUrl,
    mealType,
    tags,
    note: noteRaw.length ? noteRaw : null
  });

  revalidatePath("/meals");
}

export async function deleteMeal(formData: FormData) {
  const userId = await requireUserId();
  const mealId = String(formData.get("meal_id") ?? "");

  if (!mealId) {
    throw new Error("Meal id required.");
  }

  await removeMeal(userId, mealId);
  revalidatePath("/meals");
}
