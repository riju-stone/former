export type FormOptionType = {
  id: string;
  value: string;
};

export type FormElementConstraintType = {
  id: string;
  type: string;
  name: string;
  defaultValue: string;
  customValue: string | null;
};

export type FormElementType = {
  id: string;
  step: number;
  main_title: string;
  sub_title?: string;
  type: string;
  options?: Array<FormOptionType>;
  constraints?: Array<FormElementConstraintType>;
};

export type FormDraftType = {
  id: string;
  userId: string;
  formName: string;
  builderData: Array<FormElementType>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type FormPublishType = {
  id: string;
  userId: string;
  formName: string;
  builderData: Array<FormElementType>;
  createdAt?: Date;
  updatedAt?: Date;
  formExpiry: Date;
};

export type FormSubmissionType = {
  id: string;
  user_email: string;
  formId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
