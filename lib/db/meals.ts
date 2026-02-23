import { db } from "./index";

type MealInput = {
  timestamp: Date;
  photoUrl: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | null;
  tags: string[];
  note: string | null;
};

export async function listMeals(userId: string) {
  return db.meal.findMany({
    where: { userId },
    orderBy: { timestamp: "desc" }
  });
}

export async function createMeal(userId: string, payload: MealInput) {
  return db.meal.create({
    data: {
      userId,
      timestamp: payload.timestamp,
      photoUrl: payload.photoUrl,
      mealType: payload.mealType ?? null,
      tags: payload.tags,
      note: payload.note
    }
  });
}

export async function deleteMeal(userId: string, mealId: string) {
  return db.meal.delete({
    where: {
      id: mealId,
      userId
    }
  });
}
