import { create } from "zustand";

export type FormErrorType = "form" | "block"

export type FormErrorObject = {
    errorType: FormErrorType;
    errorCode: number;
    blockId?: string;
    formId: string;
}

export type FormErrorState = {
    errorStack: Array<FormErrorObject> | [];
}

export type FormErrorActions = {
    setFormError: (errorObj: Array<FormErrorObject>) => void;
}

export const useFormErrorStore = create<FormErrorState & FormErrorActions>((set => ({
    errorStack: [],
    setFormError: (errors: Array<FormErrorObject>) => set(() => ({
        errorStack: errors
    }))
})))
