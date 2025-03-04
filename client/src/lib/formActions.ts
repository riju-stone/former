"use client"

import { deleteFormDraft, uploadBuild, uploadDraft } from "@/db/queries";
import { FormState } from "@/store/formStore";

export async function publishFormBuild(formObject: FormState) {
    await deleteFormDraft(formObject)
    await uploadBuild(formObject)
    localStorage.removeItem(`form-build-${formObject.formId}`);
}

export async function saveFormBuild(formObject: FormState) {
    await uploadDraft(formObject)
}

export async function saveFormDraft(formObject: FormState) {
    localStorage.setItem(
        `form-build-${formObject.formId}`,
        JSON.stringify(formObject),
    );

}

