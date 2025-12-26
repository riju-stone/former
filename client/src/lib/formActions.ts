"use client";

import { uploadBuild } from "@/db/queries";
import { FormState } from "@/store/formBuilderStore";

export async function saveFormBuild(formObject: FormState) {
  await uploadBuild(formObject);
  localStorage.removeItem(`form-build-${formObject.formId}`);
}

export async function saveFormBuildLocally(formObject: FormState) {
  localStorage.setItem(`form-build-${formObject.formId}`, JSON.stringify(formObject));
}
