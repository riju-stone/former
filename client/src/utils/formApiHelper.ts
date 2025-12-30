"use client";

import { env } from "@/env";
import { FormState, FormBuild } from "@/types/formBuilderState";

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }
  const data = await response.json();
  return data;
}

export async function saveFormBuildLocally(formObject: FormState) {
  if (typeof window !== "undefined") {
    localStorage.setItem(`form-build-${formObject.formId}`, JSON.stringify(formObject));
  }
}

export async function saveFormDraft(formData: FormState) {
  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ formData }),
    credentials: "include",
  });
  return handleResponse(res);
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

export async function publishForm(formObject: FormState) {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/form/builder/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData: formObject }),
      credentials: "include",
    });
    return handleResponse(res);
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
