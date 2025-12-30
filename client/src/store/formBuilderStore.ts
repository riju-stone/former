"use client";

import { create } from "zustand";
import { v7 as uuid } from "uuid";
import { immer } from "zustand/middleware/immer";
import { FormActions, FormElement, FormOption, FormState, FormBuilderData } from "@/types/formBuilderState";
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

      updateFormBlockTitle: (title: string, formBlockId: string) =>
        set((state) => {
          state.formBuilderData[formBlockId].formBlockTitle = title;
          debouncedValidation();
        }),

      setElements: (elements: Array<FormElement>, formBlockId: string) =>
        set((state) => {
          state.formBuilderData[formBlockId].formBlockElements = elements;
        }),

      addElement: (el: Array<FormElement>, formBlockId: string) =>
        set((state) => {
          state.formBuilderData[formBlockId].formBlockElements.push(...el);
          state.formErrors = validateForm(state);
        }),

      deleteElement: (id: string, formBlockId: string) =>
        set((state) => {
          // Optimization: Break loop once found
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            state.formBuilderData[formBlockId].formBlockElements.splice(path.index, 1);
            state.formErrors = validateForm(state);
          }
        }),

      updateElementType: (id: string, type: string, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            const element = state.formBuilderData[formBlockId].formBlockElements[path.index];
            element.type = type;

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

      updateElementTitle: (id: string, title: string, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            state.formBuilderData[formBlockId].formBlockElements[path.index].main_title = title;
            debouncedValidation();
          }
        }),

      updateElementSubtitle: (id: string, subtitle: string, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            state.formBuilderData[formBlockId].formBlockElements[path.index].sub_title = subtitle;
          }
        }),

      updateElementConstraint: (elementId: string, constraintId: string, updatedValue: any, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, elementId);
          if (path) {
            const element = state.formBuilderData[formBlockId].formBlockElements[path.index];
            const constraint = element.constraints.find((c) => c.id === constraintId);

            if (constraint) {
              constraint.customValue = updatedValue;
              state.formErrors = validateForm(state);
            }
          }
        }),

      addOption: (id: string, opt: FormOption, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            const element = state.formBuilderData[formBlockId].formBlockElements[path.index];
            if (!element.options) element.options = [];
            element.options.push(opt);
            state.formErrors = validateForm(state);
          }
        }),

      updateOption: (elId: string, optId: string, optValue: string, formBlockId: string) =>
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, elId);
          if (path) {
            const element = state.formBuilderData[formBlockId].formBlockElements[path.index];
            const option = element.options?.find((opt) => opt.id === optId);
            if (option) {
              option.value = optValue;
              debouncedValidation();
            }
          }
        }),

      validateElement: (id: string, formBlockId: string) => {
        set((state) => {
          const path = findElementPath(state.formBuilderData[formBlockId].formBlockElements, id);
          if (path) {
            const element = state.formBuilderData[formBlockId].formBlockElements[path.index];
            const codes = validateSingleElement(element);

            if (codes.length > 0) {
              state.formErrors.formElementErrors[id] = {
                elementId: id,
                elementErrorCode: codes,
              };
            } else {
              delete state.formErrors.formElementErrors[id];
            }
          }
        });
      },

      addFormBlock: () =>
        set((state) => {
          const formBlockId = uuid();
          state.formBuilderData[formBlockId] = {
            blockId: formBlockId,
            formBlockTitle: "",
            formBlockElements: [],
          };
          state.formSteps += 1;
          state.formErrors = validateForm(state);
        }),

      deleteFormBlock: (formBlockId: string) =>
        set((state) => {
          // Make sure formSteps is at least 1
          if (state.formSteps <= 1) {
            const initState = initFormState();
            state.formBuilderData = initState.formBuilderData;
            state.formSteps = 1;
            state.formErrors = validateForm(state);
            return;
          }
          delete state.formBuilderData[formBlockId];
          state.formSteps -= 1;
          state.formErrors = validateForm(state);
        }),

      loadForm: (data: Record<string, FormBuilderData>, steps: number, id: string, title: string) =>
        set((state) => {
          state.formBuilderData = data;
          state.formSteps = steps;
          state.formId = id;
          state.formTitle = title;
          state.formErrors = validateForm(state);
          // Ensure formId is correctly set in formErrors if needed, or other dependent states
          state.formErrors.formId = id;
        }),
    };
  })
);

export type { FormState, FormElement, FormOption };
