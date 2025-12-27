// Define specific error codes for better type safety
export enum FormErrorCode {
  EMPTY_FORM_TITLE = 0,
  UNSUPPORTED_TITLE = 1,
  MAX_LENGTH_REACHED = 2,
  EMPTY_FORM_BLOCK = 3,
  EMPTY_FORM_ELEMENT_TITLE = 4,
  EMPTY_OPTION = 5,
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
  step: number;
  main_title: string;
  sub_title?: string;
  type: string;
  options?: Array<FormOption>;
  constraints: Array<FormElementConstraint>; // Removed | [] as Array covers it
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

export type FormBuilderData = Record<string, Array<FormElement>>;

export type FormState = {
  formId: string;
  formTitle: string;
  formBuilderData: FormBuilderData;
  formErrors: FormError;
  formSteps: number;
};

export type FormBuild = {
  formId: string;
  formName: string;
  builderData: FormBuilderData;
  createdAt: string;
  updatedAt: string;
};

export type FormActions = {
  updateFormTitle: (title: string) => void;
  addElement: (el: Array<FormElement>, step: string) => void;
  deleteElement: (id: string) => void;
  updateElementType: (id: string, type: string) => void;
  updateElementTitle: (id: string, title: string) => void;
  updateElementSubtitle: (id: string, subtitle: string) => void;
  updateElementConstraint: (elementId: string, constraintId: string, updatedValue: any) => void;
  addOption: (id: string, opt: FormOption) => void;
  updateOption: (elId: string, optId: string, optValue: string) => void;
  resetFormStore: () => void;
  updateFormSteps: (steps: number) => void;
};
