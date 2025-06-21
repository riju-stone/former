import { create } from "zustand";
import { v7 as uuid } from "uuid";
import {
	FormActions,
	FormElement,
	FormElementError,
	FormError,
	FormOption,
	FormState,
} from "@/types/formState";

export const FORM_ERROR_TYPES = {
	EMPTY_FORM_TITLE: 0,
	UNSUPPORTED_TITLE: 1,
	MAX_LENGTH_REACHED: 2,
	EMPTY_FORM: 3,
	EMPTY_BLOCK_TITLE: 4,
	EMPTY_OPTION: 5,
};

const initFormState = () => {
	const formId = uuid();

	return <FormState>{
		formId: formId,
		formTitle: "",
		formElements: [],
		formErrors: {
			formId: formId,
			formErrorCode: [
				FORM_ERROR_TYPES.EMPTY_FORM_TITLE,
				FORM_ERROR_TYPES.EMPTY_FORM,
			],
			formBlockErrors: null,
		},
	};
};

const getElementIndex = (elList: Array<FormElement>, id: string) => {
	return elList.findIndex((element) => element.id === id);
};

const deleteFromFormElements = (elId: string, elList: Array<FormElement>) => {
	const filteredList = elList.filter((el) => el.id !== elId);
	return filteredList;
};

const getUpdatedElementType = (
	elList: Array<FormElement>,
	id: string,
	type: string
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
	op: string
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
	newOption: FormOption
) => {
	const idx = getElementIndex(elList, id);

	elList[idx].options.push(newOption);
	return elList;
};

const getUpdatedOptions = (
	elList: Array<FormElement>,
	elId: string,
	optId: string,
	optValue: string
) => {
	const idx = getElementIndex(elList, elId);
	elList[idx].options[Number(optId) - 1].value = optValue;

	return elList;
};

const validateFormTitle = (title: string): number[] => {
	const errors: number[] = [];
	if (!title || title.trim() === "") {
		errors.push(FORM_ERROR_TYPES.EMPTY_FORM_TITLE);
	}
	if (title.length > 100) {
		errors.push(FORM_ERROR_TYPES.MAX_LENGTH_REACHED);
	}

	return errors;
};

const validateFormElements = (
	elements: Array<FormElement>
): { formErrors: number[]; blockErrors: Record<string, FormElementError> } => {
	const formErrors: number[] = [];
	const blockErrors: Record<string, FormElementError> = {};

	console.log("Validation Form Elements: ", elements);

	if (!elements || elements.length === 0) {
		formErrors.push(FORM_ERROR_TYPES.EMPTY_FORM);
		return { formErrors, blockErrors };
	}

	elements.forEach((el) => {
		const blockErrorCodes: number[] = [];

		if (!el.main_title || el.main_title.trim() === "") {
			blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_BLOCK_TITLE);
		}

		if (el.type === "option" && el.options) {
			el.options.forEach((opt) => {
				if (!opt.value || opt.value.trim() === "") {
					blockErrorCodes.push(FORM_ERROR_TYPES.EMPTY_OPTION);
				}
			});
		}

		console.log("Block Errors: ", blockErrorCodes);

		if (blockErrorCodes.length > 0) {
			blockErrors[el.id] = {
				blockId: el.id,
				blockErrorCode: blockErrorCodes,
			};
		}
	});

	return { formErrors, blockErrors };
};

const validateForm = (formState: FormState): FormError => {
	const formTitleErrors = validateFormTitle(formState.formTitle);
	const { formErrors, blockErrors } = validateFormElements(
		formState.formElements
	);
	return {
		formId: formState.formId,
		formErrorCode: [...formTitleErrors, ...formErrors],
		formBlockErrors: blockErrors,
	};
};

export const useFormStore = create<FormState & FormActions>((set) => ({
	...initFormState(),
	resetFormStore: () =>
		set(() => ({
			...initFormState(),
		})),
	updateFormTitle: (title: string) =>
		set((state: FormState) => {
			const updatedState = {
				...state,
				formTitle: title,
			};
			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	addElement: (el: Array<FormElement>) =>
		set((state: FormState) => {
			const updatedState = {
				...state,
				formElements: el,
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	deleteElement: (id: string) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: deleteFromFormElements(id, state.formElements),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	updateElementType: (id: string, type: string) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: getUpdatedElementType(state.formElements, id, type),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	updateElementTitle: (id: string, title: string) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: getUpdatedElementContent(
					state.formElements,
					id,
					title,
					"main"
				),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	updateElementSubtitle: (id: string, subtitle: string) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: getUpdatedElementContent(
					state.formElements,
					id,
					subtitle,
					"sub"
				),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	addOption: (id: string, opt: FormOption) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: addOptionToElement(state.formElements, id, opt),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
	updateOption: (elId: string, optId: string, optValue: string) =>
		set((state) => {
			const updatedState = {
				...state,
				formElements: getUpdatedOptions(
					state.formElements,
					elId,
					optId,
					optValue
				),
			};

			return {
				...updatedState,
				formErrors: validateForm(updatedState),
			};
		}),
}));

export type { FormState, FormElement, FormOption };
