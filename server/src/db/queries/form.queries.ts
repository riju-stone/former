import { formBuilderTable, formPublishedTable } from "@db/schema/form.schema";
import { db } from "../index";
import { desc, eq } from "drizzle-orm";
import { FormDraftType, FormPublishType } from "types/form.types";

// Fetch Queries
export async function fetchAllLiveFormsByUser(userId: string) {
  return await db.query.formPublishedTable.findMany({
    where: eq(formPublishedTable.userId, userId),
    orderBy: [desc(formPublishedTable.createdAt)],
    columns: {
      id: true,
      formName: true,
      updatedAt: true,
    },
  });
}

export async function fetchAllSavedFormsByUser(userId: string) {
  return await db.query.formBuilderTable.findMany({
    where: eq(formBuilderTable.userId, userId),
    orderBy: [desc(formBuilderTable.createdAt)],
    columns: {
      id: true,
      formName: true,
      updatedAt: true,
    },
  });
}

export async function fetchLiveFormById(formId: string) {
  return await db
    .select()
    .from(formPublishedTable)
    .where(eq(formPublishedTable.id, formId));
}

export async function fetchSavedFormById(formId: string) {
  return await db
    .select()
    .from(formBuilderTable)
    .where(eq(formBuilderTable.id, formId));
}

// Upload queries
export async function uploadFormBuilderDraft(formData: FormDraftType) {
  return await db
    .insert(formBuilderTable)
    .values(formData)
    .onConflictDoUpdate({
      target: formBuilderTable.id,
      set: {
        formName: formData.formName,
        builderData: formData.builderData,
        updatedAt: new Date(),
      },
    });
}

export async function publishForm(formData: FormPublishType) {
  return await db.insert(formPublishedTable).values(formData);
}

// Delete Queries
export async function deleteFormBuilderDraft(formId: string) {
  return await db
    .delete(formBuilderTable)
    .where(eq(formBuilderTable.id, formId));
}

export async function deletePublishedForm(formId: string) {
  return await db
    .delete(formPublishedTable)
    .where(eq(formPublishedTable.id, formId));
}
