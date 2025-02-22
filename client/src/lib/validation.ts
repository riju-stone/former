import { FormState } from "@/store/formStore";

const ERROR_TYPES = {
    "EMPTY_TITLE": 0,
    "UNSUPPORTED_TITLE": 1,
    "MAX_LENGTH_REACHED": 2,
    "EMPTY_FORM": 3,
}

export default function validateForm(formData: FormState) {
    console.log(formData)

    const errorStack = []

    // Check if form title is not empty
    if (formData.formTitle == "") {
        console.log("Form title cannot be empty");
        errorStack.push({
            error_type: "form",
            error_code: ERROR_TYPES.EMPTY_TITLE
        })
    }

    // Check if form elements are valid
    if (formData.formElements.length == 0) {
        console.log("Need atleast one form element")
        errorStack.push({
            error_type: "form",
            error_code: ERROR_TYPES.EMPTY_FORM
        })
    } else {
        const formElements = formData.formElements;
        for (const el of formElements) {
            if (el.main_title == "") {
                console.log("Form Element:", el.id, " has empty title")
                errorStack.push({
                    error_type: "block",
                    block_id: el.id,
                    error_code: ERROR_TYPES.EMPTY_TITLE
                })
            }
        }
    }

    console.log("Error Stack: ", errorStack)
}
