// Define specific error codes for better type safety
export enum FormErrorCode {
  EMPTY_FORM_TITLE = 0,
  UNSUPPORTED_TITLE = 1,
  MAX_LENGTH_REACHED = 2,
  EMPTY_FORM_BLOCK_TITLE = 3,
  EMPTY_FORM_BLOCK = 4,
  EMPTY_FORM_ELEMENT_TITLE = 5,
  EMPTY_OPTION = 6,
}

export type FormOption = {
  id: string;
  value: string;
};

export type FormElementConstraint = {
  id: string;
  type: string;
  name: string;
  defaultValue: string;
  customValue?: string | null;
};

export type FormElement = {
  id: string;
  main_title: string;
  sub_title?: string;
  type: string;
  options?: Array<FormOption>;
  constraints: Array<FormElementConstraint>;
};

export type FormElementError = {
  elementId: string;
  elementErrorCode: Array<FormErrorCode>;
};

export type FormError = {
  formId: string;
  formErrorCode: Array<FormErrorCode>;
  formBlockErrors: Record<string, Array<FormErrorCode>>;
  formElementErrors: Record<string, FormElementError>;
};

export type FormBuilderData = {
  blockId: string;
  formBlockTitle: string;
  formBlockElements: Array<FormElement>;
};

export type FormState = {
  formId: string;
  formTitle: string;
  formBuilderData: Record<string, FormBuilderData>;
  formErrors: FormError;
  formSteps: number;
};

export type FormBuild = {
  formId: string;
  formName: string;
  builderData: Array<FormBuilderData>;
  createdAt: string;
  updatedAt: string;
};

export type FormActions = {
  updateFormTitle: (title: string) => void;
  updateFormBlockTitle: (title: string, formBlockId: string) => void;
  setElements: (elements: Array<FormElement>, formBlockId: string) => void;
  addElement: (el: Array<FormElement>, formBlockId: string) => void;
  deleteElement: (id: string, formBlockId: string) => void;
  updateElementType: (id: string, type: string, formBlockId: string) => void;
  updateElementTitle: (id: string, title: string, formBlockId: string) => void;
  updateElementSubtitle: (id: string, subtitle: string, formBlockId: string) => void;
  updateElementConstraint: (elementId: string, constraintId: string, updatedValue: any, formBlockId: string) => void;
  addOption: (id: string, opt: FormOption, formBlockId: string) => void;
  updateOption: (elId: string, optId: string, optValue: string, formBlockId: string) => void;
  resetFormStore: () => void;
  addFormBlock: () => void;
  deleteFormBlock: (formBlockId: string) => void;
};
