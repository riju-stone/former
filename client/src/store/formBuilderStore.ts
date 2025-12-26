import { create } from "zustand";
import { v7 as uuid } from "uuid";
import { immer } from "zustand/middleware/immer";
import {
  FormActions,
  FormElement,
  FormOption,
  FormState,
} from "@/types/formBuilderState";
import { FormTypes } from "@/types/formMetadata";
import {
  initFormState,
  findElementPath,
  validateForm,
  validateSingleElement,
  createDebouncedValidation,
} from "@/utils/formBuilderHelper";

export const useFormStore = create<FormState & FormActions>()(
  immer((set, get) => {
    const debouncedValidation = createDebouncedValidation(get, set);

    return {
      ...initFormState(),

      resetFormStore: () =>
        set(() => ({
          ...initFormState(),
        })),

      updateFormTitle: (title: string) =>
        set((state) => {
          state.formTitle = title;
          debouncedValidation();
        }),

      addElement: (el: Array<FormElement>, step: string) =>
        set((state) => {
          state.formBuilderData[step] = el;
          state.formErrors = validateForm(state);
        }),

      deleteElement: (id: string) =>
        set((state) => {
          // Optimization: Break loop once found
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            state.formBuilderData[path.stepKey].splice(path.index, 1);
            state.formErrors = validateForm(state);
          }
        }),

      updateElementType: (id: string, type: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            const element = state.formBuilderData[path.stepKey][path.index];
            element.type = type;

            // Logic extraction for cleaner code
            const formType = FormTypes.find((ft) => ft.tag === type);
            element.constraints = formType
              ? formType.validations.map((val) => ({
                  id: uuid(),
                  type: val.type,
                  name: val.name,
                  defaultValue: val.defaultValue.toString(),
                  customValue: null,
                }))
              : [];

            if (type === "option") {
              element.options = [{ id: "1", value: "Option 1" }];
            }
            state.formErrors = validateForm(state);
          }
        }),

      updateElementTitle: (id: string, title: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            state.formBuilderData[path.stepKey][path.index].main_title = title;
            debouncedValidation();
          }
        }),

      updateElementSubtitle: (id: string, subtitle: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            state.formBuilderData[path.stepKey][path.index].sub_title =
              subtitle;
          }
        }),

      updateElementConstraint: (
        elementId: string,
        constraintId: string,
        updatedValue: any
      ) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, elementId);
          if (path) {
            const element = state.formBuilderData[path.stepKey][path.index];
            const constraint = element.constraints.find(
              (c) => c.id === constraintId
            );

            if (constraint) {
              constraint.customValue = updatedValue;
              state.formErrors = validateForm(state);
            }
          }
        }),

      addOption: (id: string, opt: FormOption) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            const element = state.formBuilderData[path.stepKey][path.index];
            if (!element.options) element.options = [];
            element.options.push(opt);
            state.formErrors = validateForm(state);
          }
        }),

      updateOption: (elId: string, optId: string, optValue: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData, elId);
          if (path) {
            const element = state.formBuilderData[path.stepKey][path.index];
            const option = element.options?.find((opt) => opt.id === optId);
            if (option) {
              option.value = optValue;
              debouncedValidation();
            }
          }
        }),

      addBatchUpdate: (updater: (draft: FormState) => void) =>
        set((state) => {
          updater(state);
          state.formErrors = validateForm(state);
        }),

      validateElement: (id: string) => {
        set((state) => {
          const path = findElementPath(state.formBuilderData, id);
          if (path) {
            const element = state.formBuilderData[path.stepKey][path.index];
            const codes = validateSingleElement(element);

            if (codes.length > 0) {
              state.formErrors.formBlockErrors[id] = {
                blockId: id,
                blockErrorCode: codes,
              };
            } else {
              delete state.formErrors.formBlockErrors[id];
            }
          }
        });
      },

      updateFormSteps: (steps: number) =>
        set((state) => {
          // Make sure formSteps is at least 1
          if (steps < 1) steps = 1;
          state.formSteps = steps;
          const stepKey = `step${steps}`;
          if (!state.formBuilderData[stepKey]) {
            state.formBuilderData[stepKey] = [];
          }
        }),
    };
  })
);

export type { FormState, FormElement, FormOption };
