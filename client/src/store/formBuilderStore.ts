import { create } from "zustand";
import { v7 as uuid } from "uuid";
import { immer } from "zustand/middleware/immer";
import { debounce } from "lodash";
import {
  FormActions,
  FormElement,
  FormElementConstraint,
  FormElementError,
  FormError,
  FormOption,
  FormState,
} from "@/types/formState";
import { FormTypes } from "@/types/formBuild";

export const FORM_ERROR_TYPES = {
  EMPTY_FORM_TITLE: 0,
  UNSUPPORTED_TITLE: 1,
  MAX_LENGTH_REACHED: 2,
  EMPTY_FORM: 3,
  EMPTY_BLOCK_TITLE: 4,
  EMPTY_OPTION: 5,
};

const initFormState = () => {
  const formId = uuid();

  return <FormState>{
    formId: formId,
    formTitle: "",
    formBuilderData: [],
    formErrors: {
      formId: formId,
      formErrorCode: [
        FORM_ERROR_TYPES.EMPTY_FORM_TITLE,
        FORM_ERROR_TYPES.EMPTY_FORM,
      ],
      formBlockErrors: {},
    },
  };
};

const validateFormTitle = (title: string): number[] => {
  const errors: number[] = [];
  if (!title || title.trim() === "") {
    errors.push(FORM_ERROR_TYPES.EMPTY_FORM_TITLE);
  }
  if (title.length > 100) {
    errors.push(FORM_ERROR_TYPES.MAX_LENGTH_REACHED);
  }

  return errors;
};

const validateFormElements = (
  elements: Array<FormElement>
): { formErrors: number[]; blockErrors: Record<string, FormElementError> } => {
  const formErrors: number[] = [];
  const blockErrors: Record<string, FormElementError> = {};

  console.log("Validation Form Elements: ", elements);

  if (!elements || elements.length === 0) {
    formErrors.push(FORM_ERROR_TYPES.EMPTY_FORM);
    return { formErrors, blockErrors };
  }

  elements.forEach((el) => {
    const blockErrorCodes: number[] = [];

    if (!el.main_title || el.main_title.trim() === "") {
      blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_BLOCK_TITLE);
    }

    if (el.type === "option" && el.options) {
      el.options.forEach((opt) => {
        if (!opt.value || opt.value.trim() === "") {
          blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_OPTION);
        }
      });
    }

    console.log("Block Errors: ", blockErrorCodes);

    if (blockErrorCodes.length > 0) {
      blockErrors[el.id] = {
        blockId: el.id,
        blockErrorCode: blockErrorCodes,
      };
    }
  });

  return { formErrors, blockErrors };
};

const validateForm = (formState: FormState): FormError => {
  const formTitleErrors = validateFormTitle(formState.formTitle);
  const { formErrors, blockErrors } = validateFormElements(
    formState.formBuilderData
  );
  return {
    formId: formState.formId,
    formErrorCode: [...formTitleErrors, ...formErrors],
    formBlockErrors: blockErrors,
  };
};

// Create debounced validation
const debouncedValidation = debounce(
  (getState: () => FormState & FormActions, setState: any) => {
    const state = getState();
    setState((draft: FormState) => {
      draft.formErrors = validateForm(state);
    });
  },
  300
);

export const useFormStore = create<FormState & FormActions>()(
  immer((set, get) => ({
    ...initFormState(),

    resetFormStore: () =>
      set(() => ({
        ...initFormState(),
      })),

    updateFormTitle: (title: string) =>
      set((state) => {
        state.formTitle = title;
        // Trigger debounced validation
        debouncedValidation(get, set);
      }),

    addElement: (el: Array<FormElement>) =>
      set((state) => {
        state.formBuilderData = el;
        // Immediate validation for structural changes
        state.formErrors = validateForm(state);
      }),

    deleteElement: (id: string) =>
      set((state) => {
        state.formBuilderData = state.formBuilderData.filter(
          (el) => el.id !== id
        );
        // Immediate validation for structural changes
        state.formErrors = validateForm(state);
      }),

    updateElementType: (id: string, type: string) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === id);
        if (element) {
          element.type = type;
          element.constraints = FormTypes.find((ft) => ft.tag === type)
            ? [...FormTypes.find((ft) => ft.tag === type)!.validations].map(
                (val) => ({
                  id: uuid(),
                  type: val.type,
                  name: val.name,
                  defaultValue: val.defaultValue.toString(),
                  customValue: null,
                })
              )
            : [];

          // Add default option if type is option
          if (type === "option") {
            element.options = [{ id: "1", value: "Option 1" }];
          }
          // Immediate validation for type changes
          state.formErrors = validateForm(state);
        }
      }),

    updateElementTitle: (id: string, title: string) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === id);
        if (element) {
          element.main_title = title;
          // Debounced validation for text inputs
          debouncedValidation(get, set);
        }
      }),

    updateElementSubtitle: (id: string, subtitle: string) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === id);
        if (element) {
          element.sub_title = subtitle;
          // No validation needed for optional subtitle
        }
      }),
    updateElementConstraint: (
      elementId: string,
      constraintId: string,
      updatedValue: any
    ) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === elementId);
        if (element) {
          if (!element.constraints) {
            element.constraints = [] as FormElementConstraint[];
          }

          const existingConstraintObj = (
            element.constraints as FormElementConstraint[]
          ).find((c) => c.id === constraintId);

          if (existingConstraintObj) {
            // Update existing constraint
            existingConstraintObj.customValue = updatedValue;
          }

          // Immediate validation for constraint changes
          state.formErrors = validateForm(state);
        }
      }),
    addOption: (id: string, opt: FormOption) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === id);
        if (element && element.options) {
          element.options.push(opt);
          // Immediate validation for structural changes
          state.formErrors = validateForm(state);
        }
      }),

    updateOption: (elId: string, optId: string, optValue: string) =>
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === elId);
        if (element && element.options) {
          const option = element.options.find((opt) => opt.id === optId);
          if (option) {
            option.value = optValue;
            // Debounced validation for option text inputs
            debouncedValidation(get, set);
          }
        }
      }),
    addBatchUpdate: (updates: Array<() => void>) => {
      set((state) => {
        updates.forEach((update) => update());
        state.formErrors = validateForm(state);
      });
    },
    validateElement: (id: string) => {
      set((state) => {
        const element = state.formBuilderData.find((el) => el.id === id);
        if (element) {
          // Validate only this element
          const { blockErrors } = validateFormElements([element]);
          if (blockErrors[id]) {
            state.formErrors.formBlockErrors[id] = blockErrors[id];
          } else {
            delete state.formErrors.formBlockErrors[id];
          }
        }
      });
    },
  }))
);

export type { FormState, FormElement, FormOption };
