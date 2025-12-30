"use client";

import { v7 as uuid } from "uuid";
import { debounce } from "lodash";
import {
  FormActions,
  FormElement,
  FormElementError,
  FormError,
  FormState,
  FormErrorCode,
  FormBuilderData,
} from "@/types/formBuilderState";

export const FORM_ERROR_TYPES = FormErrorCode;

export const initFormState = (): FormState => {
  const formId = uuid();
  const firstBlockId = uuid();

  return <FormState>{
    formId,
    formTitle: "",
    formBuilderData: {
      [firstBlockId]: {
        blockId: firstBlockId,
        formBlockTitle: "",
        formBlockElements: [],
      }
    },
    formSteps: 1,
    formErrors: {
      formId: formId,
      formErrorCode: [FORM_ERROR_TYPES.EMPTY_FORM_TITLE],
      formBlockErrors: {
        [firstBlockId]: [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK],
      },
      formElementErrors: {},
    },
  } as FormState;
};

// Helper to check if the form has errors
export const doesFormHaveErrors = (formErrors: FormError) => {
  return formErrors.formErrorCode.length > 0 || Object.keys(formErrors.formBlockErrors).length > 0 || Object.keys(formErrors.formElementErrors).length > 0
};

// Helper to find element location quickly
export const findElementPath = (
  data: Array<FormElement>,
  id: string
): { index: number } | null => {
  const index = data.findIndex((el) => el.id === id);
  if (index !== -1) return { index };
  return null;
};

export const validateFormTitle = (title: string): FormErrorCode[] => {
  const errors: FormErrorCode[] = [];
  if (!title || title.trim() === "") {
    errors.push(FORM_ERROR_TYPES.EMPTY_FORM_TITLE);
  }
  if (title.length > 100) {
    errors.push(FORM_ERROR_TYPES.MAX_LENGTH_REACHED);
  }
  return errors;
};

export const validateSingleElement = (el: FormElement): number[] => {
  const blockErrorCodes: number[] = [];
  if (!el.main_title || el.main_title.trim() === "") {
    blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_FORM_ELEMENT_TITLE);
  }
  if (el.type === "option" && el.options) {
    el.options.forEach((opt) => {
      if (!opt.value || opt.value.trim() === "") {
        blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_OPTION);
      }
    });
  }
  return blockErrorCodes;
};

export const validateFormBlocks = (
  formBlocks: Record<string, FormBuilderData>
): { formBlockErrors: Record<string, Array<FormErrorCode>> } => {
  const formBlockErrors: Record<string, Array<FormErrorCode>> = {};

  Object.values(formBlocks).forEach((block) => {
    if (block.formBlockElements.length === 0) {
      formBlockErrors[block.blockId] = [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK];
    }
    if (!block.formBlockTitle || block.formBlockTitle.trim() === "") {
      formBlockErrors[block.blockId] = [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK_TITLE];
    }
  });

  return { formBlockErrors };
};

export const validateFormElements = (
  elements: Array<FormElement>
): { formElementErrors: Record<string, FormElementError> } => {
  const formElementErrors: Record<string, FormElementError> = {};

  elements.forEach((el) => {
    const codes = validateSingleElement(el);
    if (codes.length > 0) {
      formElementErrors[el.id] = {
        elementId: el.id,
        elementErrorCode: codes,
      };
    }
  });

  return { formElementErrors };
};

export const validateForm = (formState: FormState): FormError => {
  const formTitleErrors = validateFormTitle(formState.formTitle);
  const { formBlockErrors } = validateFormBlocks(formState.formBuilderData);
  const { formElementErrors } = validateFormElements(Object.values(formState.formBuilderData).flat().map((block) => block.formBlockElements).flat() as Array<FormElement>);

  return {
    formId: formState.formId,
    formErrorCode: [...formTitleErrors],
    formBlockErrors: formBlockErrors,
    formElementErrors: formElementErrors,
  };
};

// Factory to create a debounced validation function bound to the store's get/set
export const createDebouncedValidation = (getState: () => FormState & FormActions, setState: any, wait = 300) =>
  debounce(() => {
    const state = getState();
    setState((draft: FormState) => {
      draft.formErrors = validateForm(state);
    });
  }, wait);
