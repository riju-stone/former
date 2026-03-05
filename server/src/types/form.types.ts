export const VALID_ELEMENT_TYPES = ["short", "long", "option", "number", "url", "date"] as const;

export type FormOptionType = {
  id: string;
  value: string;
};

export type FormElementConstraintType = {
  id: string;
  type: (typeof VALID_ELEMENT_TYPES)[number];
  name: string;
  defaultValue: string;
  customValue: string | null;
};

export type FormElementType = {
  id: string;
  main_title: string;
  sub_title?: string;
  type: (typeof VALID_ELEMENT_TYPES)[number];
  options?: Array<FormOptionType>;
  constraints: Array<FormElementConstraintType>;
};

export type FormBuilderBlockType = {
  blockId: string;
  formBlockTitle: string;
  formBlockElements: Array<FormElementType>;
};

export type FormDraftType = {
  id: string;
  userId: string;
  formName: string;
  builderData: Record<string, FormBuilderBlockType>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FormPublishType = {
  id: string;
  userId: string;
  formName: string;
  builderData: Record<string, FormBuilderBlockType>;
  createdAt?: Date;
  updatedAt?: Date;
  formExpiry: Date;
};

export type FormSubmissionType = {
  id: string;
  user_email: string;
  formId: string;
  submissionData: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};
