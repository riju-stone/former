export type FormOption = {
  id: string;
  value: string;
};

export type FormElementConstraint = {
  id: string;
  type: string;
  name: string;
  defaultValue: string;
  customValue: string | null;
};

export type FormElement = {
  id: string;
  step: number;
  main_title: string;
  sub_title?: string;
  type: string;
  options?: Array<FormOption>;
  constraints?: Array<FormElementConstraint>;
};

export type FormElementError = {
  blockId: string;
  blockErrorCode: Array<number> | null;
};

export type FormError = {
  formId: string;
  formErrorCode: Array<number> | null;
  formBlockErrors: Record<FormElementError["blockId"], FormElementError>;
};

export type FormState = {
  formId: string;
  formTitle: string;
  formBuilderData: Array<FormElement>;
  formErrors: FormError;
  formSteps: number;
};

export type FormActions = {
  updateFormTitle: (title: string) => void;
  addElement: (el: Array<FormElement>) => void;
  deleteElement: (id: string) => void;
  updateElementType: (id: string, type: string) => void;
  updateElementTitle: (id: string, title: string) => void;
  updateElementSubtitle: (id: string, subtitle: string) => void;
  addOption: (id: string, opt: FormOption) => void;
  updateOption: (elId: string, optId: string, optValue: string) => void;
  resetFormStore: () => void;
};
