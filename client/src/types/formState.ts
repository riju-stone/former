export type FormOption = {
	id: string;
	value: string;
};

export type FormElement = {
	id: string;
	main_title: string;
	sub_title?: string;
	type: string;
	options?: Array<FormOption>;
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
	formElements: Array<FormElement>;
	formErrors: FormError;
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
