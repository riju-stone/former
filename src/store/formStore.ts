import { create } from "zustand";
import { v7 as uuid } from "uuid";

export type Option = {
  id: string;
  value: string;
};

export type FormElement = {
  id: string;
  main_title: string;
  sub_title?: string;
  type: string;
  options?: Array<Option>;
};

export type FormState = {
  formId: string;
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
  updateOption: (elId: string, optId: string, optValue: string) => void;
  resetFormStore: () => void;
};

const getElementIndex = (elList: Array<FormElement>, id) => {
  return elList.findIndex((element) => element.id === id);
};

const getUpdatedElementType = (
  elList: Array<FormElement>,
  id: string,
  type: string,
) => {
  const idx = getElementIndex(elList, id);
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
  const idx = getElementIndex(elList, id);

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
  const idx = getElementIndex(elList, id);

  elList[idx].options.push(newOption);
  return elList;
};

const getUpdatedOptions = (
  elList: Array<FormElement>,
  elId: string,
  optId: string,
  optValue: string,
) => {
  const idx = getElementIndex(elList, elId);
  elList[idx].options[Number(optId) - 1].value = optValue;

  return elList;
};

export const useFormStore = create<FormState & FormActions>((set) => ({
  formId: uuid(),
  formTitle: "",
  formElements: [],
  resetFormStore: () =>
    set(() => ({
      formId: uuid(),
      formTitle: "",
      formElements: [],
    })),
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
  updateOption: (elId: string, optId: string, optValue: string) =>
    set((state) => ({
      formElements: getUpdatedOptions(
        state.formElements,
        elId,
        optId,
        optValue,
      ),
    })),
}));
