import { FormState } from "@/store/formStore";
import { db } from "./index";
import { formBuilderTable, formDraftTable } from "./schema";
import { eq } from "drizzle-orm";

export async function fetchFormBuild(formId: string) {
  console.log("Querying Form Builder Table: ", formId);
  return await db
    .select()
    .from(formBuilderTable)
    .where(eq(formBuilderTable.id, formId));
}

export async function fetchFormDraft(formId: string) {
  return await db
    .select()
    .from(formDraftTable)
    .where(eq(formDraftTable.id, formId));
}

export async function uploadBuild(formBuildData: FormState) {
  const formBuilderObject: typeof formBuilderTable.$inferInsert = {
    id: formBuildData.formId,
    formName: formBuildData.formTitle,
    builderData: JSON.stringify(formBuildData.formElements),
  };

  // Fetching Form Data
  const existingData = await fetchFormBuild(formBuilderObject.id);

  if (existingData.length > 0) {
    await db
      .update(formBuilderTable)
      .set(formBuilderObject)
      .where(eq(formBuilderTable.id, formBuilderObject.id));
    console.log("Form Build Updated");
  } else {
    await db.insert(formBuilderTable).values(formBuilderObject);
    console.log("Form Build Uploaded");
  }
}

export async function uploadDraft(formBuildData: FormState) {
  const formBuilderObject: typeof formDraftTable.$inferInsert = {
    id: formBuildData.formId,
    formName: formBuildData.formTitle,
    builderData: JSON.stringify(formBuildData.formElements),
  };

  const existingData = await fetchFormDraft(formBuilderObject.id);

  if (existingData.length > 0) {
    await db
      .update(formDraftTable)
      .set(formBuilderObject)
      .where(eq(formDraftTable.id, formBuilderObject.id));
  } else {
    await db.insert(formDraftTable).values(formBuilderObject);
  }
}
