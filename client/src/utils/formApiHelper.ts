"use client";

import { env } from "@/env";
import { FormState, FormBuild } from "@/types/formBuilderState";
import { v7 as uuid } from "uuid";

// Placeholder ID used for initial state
const INITIAL_FORM_ID = "00000000-0000-0000-0000-000000000000";

// Helper function to ensure form has a real UUID (not placeholder)
function ensureFormId(formObject: FormState): FormState {
  if (formObject.formId === INITIAL_FORM_ID) {
    return {
      ...formObject,
      formId: uuid(),
      formErrors: {
        ...formObject.formErrors,
        formId: uuid(),
      },
    };
  }
  return formObject;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }
  const data = await response.json();
  return data;
}

export async function saveFormBuildLocally(formObject: FormState): Promise<string> {
  const formToSave = ensureFormId(formObject);
  if (typeof window !== "undefined") {
    localStorage.setItem(`form-build-${formToSave.formId}`, JSON.stringify(formToSave));
  }
  return formToSave.formId;
}

export async function saveFormDraft(formData: FormState): Promise<{ formId: string; response: any }> {
  const formToSave = ensureFormId(formData);
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formData: formToSave }),
    credentials: "include",
  });
  const response = await handleResponse(res);
  return { formId: formToSave.formId, response };
}

export async function getFormDrafts() {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/all/saved`, {
    credentials: "include",
  });
  return handleResponse<{ data: any[] }>(res).then((r) => r.data);
}

export async function fetchFormBuilderData(formId: string): Promise<FormBuild[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/data?formId=${formId}`, {
    credentials: "include",
  });
  return handleResponse<{ data: FormBuild[] }>(res).then((r) => r.data);
}

export async function fetchLiveFormData(formId: string): Promise<FormBuild[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/data?formId=${formId}`, {
    credentials: "include",
  });
  return handleResponse<{ data: FormBuild[] }>(res).then((r) => r.data);
}

export async function publishForm(formObject: FormState): Promise<{ formId: string; response: any } | null> {
  try {
    const formToPublish = ensureFormId(formObject);
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData: formToPublish }),
      credentials: "include",
    });
    const response = await handleResponse(res);
    return { formId: formToPublish.formId, response };
  } catch (error) {
    console.error("Error publishing form:", error);
    return null;
  }
}

export async function submitFormResponse(formId: string, userEmail: string, submissionData: any) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      formSubmissionData: {
        formId,
        userEmail,
        submissionData,
      },
    }),
    credentials: "include",
  });
  return handleResponse(res);
}
