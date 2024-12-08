import { create } from "zustand";

export type Option = {
  id: string;
  value: string;
};

export type FormElement = {
  id: string;
  type: string;
  options?: Array<Option>;
};

export type FormState = {
  formTitle: string;
  formElements: Array<FormElement>;
};

export type FormActions = {
  addElement: (el: Array<FormElement>) => void;
  modifyElementType: (id: string, type: string) => void;
  addOption: (id: string, opt: Option) => void;
};

const getUpdatedElements = (
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
  formTitle: "Untitled form",
  formElements: [],
  addElement: (el: Array<FormElement>) =>
    set((state) => ({
      formTitle: state.formTitle,
      formElements: el,
    })),
  modifyElementType: (id: string, type: string) =>
    set((state) => ({
      formTitle: state.formTitle,
      formElements: getUpdatedElements(state.formElements, id, type),
    })),
  addOption: (id: string, opt: Option) =>
    set((state) => ({
      formTitle: state.formTitle,
      formElements: addOptionToElement(state.formElements, id, opt),
    })),
}));
