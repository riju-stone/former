import { create } from "zustand";

export type FormElement = {
  id: string;
  type: string;
};

export type FormState = {
  formTitle: string;
  formElements: Array<FormElement>;
};

export type FormActions = {
  addElement: (el: Array<FormElement>) => void;
  modifyElement: (el: FormElement) => void;
};

const getModifiedElementList = (
  elList: Array<FormElement>,
  el: FormElement,
) => {
  const idx = elList.findIndex((element) => element.id === el.id);
  elList[idx] = el;
  return elList;
};

export const useFormStore = create<FormState & FormActions>((set) => ({
  formTitle: "Untitled form",
  formElements: [],
  addElement: (el) =>
    set((state) => ({
      formTitle: state.formTitle,
      formElements: el,
    })),
  modifyElement: (el) =>
    set((state) => ({
      formTitle: state.formTitle,
      formElements: getModifiedElementList(state.formElements, el),
    })),
}));
