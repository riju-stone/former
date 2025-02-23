import { FormErrorObject } from "@/store/errorStore";
import { FormState } from "@/store/formStore";

const ERROR_TYPES = {
    "EMPTY_TITLE": 0,
    "UNSUPPORTED_TITLE": 1,
    "MAX_LENGTH_REACHED": 2,
    "EMPTY_FORM": 3,
    "EMPTY_OPTION": 4
}

export default function validateForm(formData: FormState) {
    console.log(formData)

    const errorStack = <Array<FormErrorObject>>[]

    // Check if form title is not empty
    if (formData.formTitle == "") {
        console.log("Form title cannot be empty");
        errorStack.push({
            formId: formData.formId,
            errorType: "form",
            errorCode: ERROR_TYPES.EMPTY_TITLE
        })
    }

    // Check if form elements are valid
    if (formData.formElements.length == 0) {
        console.log("Need atleast one form element")
        errorStack.push({
            formId: formData.formId,
            errorType: "form",
            errorCode: ERROR_TYPES.EMPTY_FORM
        })
    } else {
        const formElements = formData.formElements;
        for (const el of formElements) {
            if (el.main_title == "") {
                console.log("Form Element:", el.id, " has empty title")
                errorStack.push({
                    formId: formData.formId,
                    errorType: "block",
                    blockId: el.id,
                    errorCode: ERROR_TYPES.EMPTY_TITLE
                })
            }

            if (el.type == "option") {
                for (const op of el.options) {
                    if (op.value == "") {
                        errorStack.push({
                            formId: formData.formId,
                            errorType: "block",
                            errorCode: ERROR_TYPES.EMPTY_OPTION,
                            blockId: el.id
                        })
                        break
                    }
                }
            }
        }
    }

    console.log("Error Stack: ", errorStack)
    return errorStack;
}
