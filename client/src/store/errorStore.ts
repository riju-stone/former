import { create } from "zustand";

export type FormErrorType = "form" | "block"

export type FormErrorObject = {
    errorType: FormErrorType,
    errorCode: number,
    blockId?: string,
    formId: string,
}

export type FormErrorState = Array<FormErrorObject>

export type FormErrorActions = {
    setFormError: (errorObj: FormErrorState) => void
}

export const useFormErrorStore = create<FormErrorState & FormErrorActions>()
