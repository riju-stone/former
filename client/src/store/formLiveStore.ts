"use client";

import { create } from "zustand";
import { FormBuilderData, FormBuild } from "@/types/formBuilderState";

type FormResponse = {
  values: Record<string, any>;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
};

type FormLiveState = {
  formData: FormBuild | null;
  blocks: FormBuilderData[];
  currentStep: number;
  response: FormResponse;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
};

type FormLiveActions = {
  setFormData: (form: FormBuild | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setValue: (fieldId: string, value: any) => void;
  setTouched: (fieldId: string, touched?: boolean) => void;
  setError: (fieldId: string, message: string | null) => void;
  clearErrors: () => void;
  setSubmitting: (status: boolean) => void;
  setSubmitError: (message: string | null) => void;
  setSubmitSuccess: (status: boolean) => void;
  resetLiveForm: () => void;
};

const createInitialResponse = (): FormResponse => ({
  values: {},
  touched: {},
  errors: {},
});

export const useFormLiveStore = create<FormLiveState & FormLiveActions>((set, get) => ({
  formData: null,
  blocks: [],
  currentStep: 0,
  response: createInitialResponse(),
  isSubmitting: false,
  submitError: null,
  submitSuccess: false,

  setFormData: (form) =>
    set(() => ({
      formData: form,
      blocks: form ? Object.values(form.builderData) : [],
      currentStep: 0,
      response: createInitialResponse(),
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    })),

  setCurrentStep: (step) =>
    set((state) => ({
      currentStep: Math.max(0, Math.min(step, Math.max(state.blocks.length - 1, 0))),
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, Math.max(state.blocks.length - 1, 0)),
    })),

  prevStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 0),
    })),

  setValue: (fieldId, value) =>
    set((state) => ({
      response: {
        ...state.response,
        values: {
          ...state.response.values,
          [fieldId]: value,
        },
      },
    })),

  setTouched: (fieldId, touched = true) =>
    set((state) => ({
      response: {
        ...state.response,
        touched: {
          ...state.response.touched,
          [fieldId]: touched,
        },
      },
    })),

  setError: (fieldId, message) =>
    set((state) => {
      const nextErrors = { ...state.response.errors };
      if (message) {
        nextErrors[fieldId] = message;
      } else {
        delete nextErrors[fieldId];
      }
      return {
        response: {
          ...state.response,
          errors: nextErrors,
        },
      };
    }),

  clearErrors: () =>
    set((state) => ({
      response: {
        ...state.response,
        errors: {},
      },
    })),

  setSubmitting: (status) => set(() => ({ isSubmitting: status })),
  setSubmitError: (message) => set(() => ({ submitError: message })),
  setSubmitSuccess: (status) => set(() => ({ submitSuccess: status })),

  resetLiveForm: () =>
    set(() => ({
      formData: null,
      blocks: [],
      currentStep: 0,
      response: createInitialResponse(),
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    })),
}));
