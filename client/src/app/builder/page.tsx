"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import { toast } from "sonner";
import { FormState, useFormStore } from "@/store/formStore";
import { useRouter } from "next/navigation";
import { Eye, Save, BookCheck } from "lucide-react"
import { saveFormDraft } from "@/lib/formActions";

const styles = {
    builderPage: "h-full w-full flex justify-center items-center",
    builderWrapper:
        "h-full w-full md:w-[640px] flex-col justify-center align-middle",
    headerContainer:
        "h-[56px] w-full flex justify-between items-center bg-gray-00 px-6",
    headerNormal: "border-[1px] border-gray-200",
    headerError: "border-[2px] border-red-300",
    formTitle: "text-[16px] font-[600] border-none outline-none",
    footerContainer:
        "h-[64px] w-full md:w-[640px] flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px]",
    whiteButtonDisabled:
        "h-[32px] flex justify-center items-center gap-1 py-[6px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] leading-5 shadow-button",
    greenButtonDisabled:
        "h-[32px] flex justify-center items-center gap-1 py-[7px] px-[16px] bg-green-500 border-[1px] border-green-500 rounded-xl text-[14px] text-white font-[600] leading-5 shadow-button",
};

function FormBuilderPage()
{
    const formStore = useFormStore();
    const { formId, formTitle, formElements, formErrors, updateFormTitle } = formStore;

    const router = useRouter();

    const formObject: FormState = {
        formId: formId,
        formTitle: formTitle,
        formElements: formElements,
        formErrors: formErrors
    };

    const checkForFormErrors = () =>
    {
        return formErrors.formErrorCode.length > 0 || Object.keys(formErrors.formBlockErrors).length > 0;
    }

    const handleFormPublish = () =>
    {
        // if (!formErrors.formErrorCode && Object.keys(formErrors.formBlockErrors).length == 0) {
        //     publishFormBuild(formObject)
        //     router.push("/")
        // } else {
        //     toast.error("Form has errors. Please fix them first")
        // }
    }

    const handleFormPreview = async () =>
    {
        saveFormDraft(formObject)
        router.push(`/preview/${formId}`);
    };

    return (
        <div className={styles.builderPage}>
            <div className={styles.builderWrapper}>
                <div className={`${styles.headerContainer} ${formErrors.formErrorCode.length == 0 ? styles.headerNormal : styles.headerError}`}>
                    <input
                        id="form-title"
                        className={`${styles.formTitle}`}
                        type="text"
                        placeholder="Untitled form"
                        value={formTitle}
                        onChange={(e) => updateFormTitle(e.target.value)}
                    />
                    <button
                        className={`${styles.whiteButtonDisabled} ${!checkForFormErrors() ? "opacity-100" : "opacity-50"}`}
                        disabled={!checkForFormErrors() ? false : true}
                        onClick={() => handleFormPreview()}
                    >
                        Preview
                        <Eye size={18} />
                    </button>
                </div>
                <FormBuilderComponent />
                <div className={styles.footerContainer}>
                    <button
                        type="submit"
                        className={`${styles.whiteButtonDisabled} ${!checkForFormErrors() ? "opacity-100" : "opacity-50"}`}
                        disabled={!checkForFormErrors() ? false : true}
                    // onClick={() =>
                    //     toast.promise(handleSaveDraftGlobally(), {
                    //         loading: "Uploading Form Draft",
                    //         success: "Form Draft Uploaded",
                    //         error: "Failed to Upload Form Draft",
                    //     })
                    // }
                    >
                        <Save size={18} />
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={() => handleFormPublish()}
                        // onClick={() =>
                        //     toast.promise(handleFormUpload(), {
                        //         loading: "Uploading Current Build",
                        //         success: "Form Build Uploaded Successfully",
                        //         error: "Failed to Upload Form Build",
                        //     })
                        // }
                        className={`${styles.greenButtonDisabled} ${!checkForFormErrors() ? "opacity-100" : "opacity-50"}`}
                        disabled={!checkForFormErrors() ? false : true}
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
