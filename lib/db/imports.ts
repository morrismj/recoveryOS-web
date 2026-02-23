import { Prisma } from "@prisma/client";
import { db } from "./index";

export type ImportStatus = "uploaded" | "previewed" | "processed" | "failed";

export async function createImportJob(options: {
  userId: string;
  originalFilename: string;
  status: ImportStatus;
  rowErrors?: unknown;
}) {
  return db.importJob.create({
    data: {
      userId: options.userId,
      type: "generic_csv",
      originalFilename: options.originalFilename,
      status: options.status,
      rowErrors: options.rowErrors ?? Prisma.DbNull
    }
  });
}

export async function updateImportJob(options: {
  userId: string;
  id: string;
  status: ImportStatus;
  rowErrors?: unknown;
}) {
  const result = await db.importJob.updateMany({
    where: {
      id: options.id,
      userId: options.userId
    },
    data: {
      status: options.status,
      rowErrors: options.rowErrors ?? Prisma.DbNull
    }
  });

  if (result.count === 0) {
    throw new Error("Import job not found.");
  }
}
