import { create } from "zustand";

export type Option = {
  id: string;
  value: string;
};

export type FormElement = {
  id: string;
  main_title: string;
  sub_title?: string | null;
  type: string;
  options?: Array<Option>;
};

export type FormState = {
  formId: null | string;
  formTitle: string;
  formElements: Array<FormElement>;
};

export type FormActions = {
  updateFormTitle: (title: string) => void;
  addElement: (el: Array<FormElement>) => void;
  updateElementType: (id: string, type: string) => void;
  updateElementTitle: (id: string, title: string) => void;
  updateElementSubtitle: (id: string, subtitle: string) => void;
  addOption: (id: string, opt: Option) => void;
};

const getUpdatedElementType = (
  elList: Array<FormElement>,
  id: string,
  type: string,
) => {
  const idx = elList.findIndex((element) => element.id === id);
  elList[idx].type = type;

  // Add a default option
  if (type == "option") {
    elList[idx].options = Array.from([{ id: "1", value: "Option 1" }]);
  }

  return elList;
};

const getUpdatedElementContent = (
  elList: Array<FormElement>,
  id: string,
  content: string,
  op: string,
) => {
  const idx = elList.findIndex((element) => element.id === id);

  if (op == "main") {
    elList[idx].main_title = content;
  } else if (op == "sub") {
    elList[idx].sub_title = content;
  }

  return elList;
};

const addOptionToElement = (
  elList: Array<FormElement>,
  id: string,
  newOption: Option,
) => {
  const idx = elList.findIndex((element) => element.id === id);
  elList[idx].options.push(newOption);
  return elList;
};

export const useFormStore = create<FormState & FormActions>((set) => ({
  formId: null,
  formTitle: "Untitled form",
  formElements: [],
  updateFormTitle: (title: string) =>
    set((state) => ({
      formTitle: title,
      formElements: state.formElements,
    })),
  addElement: (el: Array<FormElement>) =>
    set(() => ({
      formElements: el,
    })),
  updateElementType: (id: string, type: string) =>
    set((state) => ({
      formElements: getUpdatedElementType(state.formElements, id, type),
    })),
  updateElementTitle: (id: string, title: string) =>
    set((state) => ({
      formElements: getUpdatedElementContent(
        state.formElements,
        id,
        title,
        "main",
      ),
    })),
  updateElementSubtitle: (id: string, subtitle: string) =>
    set((state) => ({
      formElements: getUpdatedElementContent(
        state.formElements,
        id,
        subtitle,
        "sub",
      ),
    })),
  addOption: (id: string, opt: Option) =>
    set((state) => ({
      formElements: addOptionToElement(state.formElements, id, opt),
    })),
}));
