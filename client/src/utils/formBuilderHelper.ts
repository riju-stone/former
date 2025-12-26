import { v7 as uuid } from "uuid";
import { debounce } from "lodash";
import {
  FormActions,
  FormElement,
  FormElementError,
  FormError,
  FormState,
  FormErrorCode,
} from "@/types/formBuilderState";

export const FORM_ERROR_TYPES = FormErrorCode;

export const initFormState = (): FormState => {
  const formId = uuid();

  return <FormState>{
    formId,
    formTitle: "",
    formBuilderData: {
      step1: [],
    },
    formSteps: 1,
    formErrors: {
      formId,
      formErrorCode: [FORM_ERROR_TYPES.EMPTY_FORM_TITLE],
      formBlockErrors: {
        step1: [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK],
      },
      formElementErrors: {},
    },
  };
};

// Helper to find element location quickly
export const findElementPath = (
  data: Record<string, FormElement[]>,
  id: string
): { stepKey: string; index: number } | null => {
  for (const stepKey in data) {
    const index = data[stepKey].findIndex((el) => el.id === id);
    if (index !== -1) return { stepKey, index };
  }
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
  elements: Record<string, Array<FormElement>>
): { formBlockErrors: Record<string, Array<FormErrorCode>> } => {
  let formBlocks = Object.keys(elements);
  const formBlockErrors: Record<string, Array<FormErrorCode>> = {};

  formBlocks.forEach((blockKey) => {
    if (elements[blockKey].length === 0) {
      formBlockErrors[blockKey] = [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK];
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
  const { formElementErrors } = validateFormElements(Object.values(formState.formBuilderData).flat());

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
