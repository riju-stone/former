import { FormState } from "@/types/formBuilderState";
import { db } from "./index";
import { formBuilderTable } from "./schema";
import { eq } from "drizzle-orm";

export async function fetchAllFormBuilds() {
  return await db.select().from(formBuilderTable);
}

export async function fetchFormBuild(formId: string) {
  console.log("Querying Form Builder Table: ", formId);
  return await db.select().from(formBuilderTable).where(eq(formBuilderTable.id, formId));
}

export async function uploadBuild(formBuildData: FormState) {
  const formBuilderObject: typeof formBuilderTable.$inferInsert = {
    id: formBuildData.formId,
    formName: formBuildData.formTitle,
    builderData: JSON.stringify(formBuildData.formBuilderData),
  };

  // Fetching Form Data
  const existingData = await fetchFormBuild(formBuilderObject.id);

  if (existingData.length > 0) {
    await db.update(formBuilderTable).set(formBuilderObject).where(eq(formBuilderTable.id, formBuilderObject.id));
    console.log("Form Build Updated");
  } else {
    await db.insert(formBuilderTable).values(formBuilderObject);
    console.log("Form Build Uploaded");
  }
}
