"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import { toast } from "sonner";
import { useFormStore } from "@/store/formBuilderStore";
import { FormState } from "@/types/formState";
import { useRouter } from "next/navigation";
import { Eye, Save, BookCheck } from "lucide-react"
import { saveFormBuildLocally, saveFormBuild } from "@/lib/formActions";

function FormBuilderPage() {
    const formStore = useFormStore();
    const { formId, formTitle, formElements, formErrors, updateFormTitle } = formStore;

    const router = useRouter();

    const formObject: FormState = {
        formId: formId,
        formTitle: formTitle,
        formElements: formElements,
        formErrors: formErrors,
        formSteps: 1, // Not implemented yet
    };

    const checkForFormErrors = () => {
        return formErrors.formErrorCode.length > 0 || Object.keys(formErrors.formBlockErrors).length > 0;
    }

    const handleFormPublish = () => {
        if (!checkForFormErrors()) {
            saveFormBuild(formObject)
            router.push("/")
            toast.success("Form published successfully")
        } else {
            toast.error("Form has errors. Please fix them first")
        }
    }

    const handleFormPreview = () => {
        if (!checkForFormErrors()) {
            saveFormBuildLocally(formObject)
            router.push(`/preview/${formId}`);

        } else {
            toast.error("Form has errors. Please fix them first")
        }
    };

    const handleFormDraft = () => {
        if (!checkForFormErrors()) {
            saveFormBuild(formObject)
            router.push("/")
            toast.success("Form build saved successfully")
        } else {
            toast.error("Form has errors. Please fix them first")
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className={`h-[56px] w-[95%] flex justify-between items-center px-4 rounded-bl-xl rounded-br-xl mb-2
                    ${formErrors.formErrorCode.length == 0 ?
                        "border-[1px] border-gray-200 bg-gray-50" :
                        "border-[2px] border-red-200 bg-red-50"}
                        `}>
                    <input
                        id="form-title"
                        className={`text-[16px] w-[75%] font-[600] bg-transparent border-none outline-none`}
                        type="text"
                        placeholder="Untitled form"
                        value={formTitle}
                        onChange={(e) => updateFormTitle(e.target.value)}
                    />
                    <button
                        className={`h-[32px] flex justify-center items-center gap-1 py-[6px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] leading-5 shadow-button "opacity-100"`}
                        onClick={() => handleFormPreview()}
                    >
                        Preview
                        <Eye size={18} />
                    </button>
                </div>
                <FormBuilderComponent />
                <div className={`bottom-0 h-[64px] w-[95%] flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px] rounded-tr-xl rounded-tl-xl mt-2
                    ${formErrors.formErrorCode.length == 0 ?
                        "border-[1px] border-gray-200 bg-gray-50" :
                        "border-[2px] border-red-200 bg-red-50"}
                        `}>
                    <button
                        type="submit"
                        className={`h-[32px] flex justify-center items-center gap-1 py-[6px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] leading-5 shadow-button opacity-100`}
                        onClick={() => handleFormDraft()}
                    >
                        <Save size={18} />
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={() => handleFormPublish()}
                        className={`h-[32px] flex justify-center items-center gap-1 py-[7px] px-[16px] bg-green-500 border-[1px] border-green-500 rounded-xl text-[14px] text-white font-[600] leading-5 shadow-button opacity-100`}
                    >
                        <BookCheck size={18} />
                        Publish Form
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FormBuilderPage;
