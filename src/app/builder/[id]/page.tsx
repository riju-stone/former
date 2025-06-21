"use client"

import React, { use, useEffect, useState } from 'react'
import FormBuilderComponent from "@/components/form/form-builder";
import { toast } from "sonner";
import { useFormStore } from "@/store/formStore";
import { FormElement, FormState } from "@/types/formState";
import { useRouter } from "next/navigation";
import { Eye, Save, BookCheck } from "lucide-react"
import { saveFormBuildLocally, saveFormBuild } from "@/lib/formActions";
import { fetchFormBuild } from "@/db/queries";

const styles = {
    builderPage: "h-full w-full flex justify-center items-center",
    builderWrapper:
        "h-full w-full md:w-[640px] flex-col justify-center align-middle",
    headerContainer:
        "h-[56px] w-full flex justify-between items-center px-6",
    headerNormal: "border-[1px] border-gray-200 bg-gray-50",
    headerError: "border-[2px] border-red-200 bg-red-50",
    formTitle: "text-[16px] font-[600] bg-transparent border-none outline-none",
    footerContainer:
        "h-[64px] w-full md:w-[640px] flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px]",
    whiteButtonDisabled:
        "h-[32px] flex justify-center items-center gap-1 py-[6px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] leading-5 shadow-button",
    greenButtonDisabled:
        "h-[32px] flex justify-center items-center gap-1 py-[7px] px-[16px] bg-green-500 border-[1px] border-green-500 rounded-xl text-[14px] text-white font-[600] leading-5 shadow-button",
    loadingState:
        "flex items-center justify-center h-full w-full",
};

function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [isLoading, setIsLoading] = useState(true);
    const formStore = useFormStore();
    const {
        formId,
        formTitle,
        formElements,
        formErrors,
        updateFormTitle,
        resetFormStore,
        addElement
    } = formStore;

    const router = useRouter();

    useEffect(() => {
        const loadFormData = async () => {
            try {
                setIsLoading(true);
                const formData = await fetchFormBuild(id);

                if (formData.length > 0) {
                    // Reset the form store first
                    resetFormStore();

                    // Parse the builder data from JSON string to object
                    const builderData = formData[0].builderData;

                    // Update form title
                    updateFormTitle(formData[0].formName);

                    // Add form elements
                    addElement(builderData as FormElement[]);

                    toast.success("Form build loaded successfully");
                } else {
                    toast.error("Form not found");
                    router.push("/builder");
                }
            } catch (error) {
                console.error("Error loading form:", error);
                toast.error("Failed to load form");
            } finally {
                setIsLoading(false);
            }
        };

        loadFormData();
    }, [id, resetFormStore, updateFormTitle, addElement, router]);

    const formObject: FormState = {
        formId: formId,
        formTitle: formTitle,
        formElements: formElements,
        formErrors: formErrors
    };

    const checkForFormErrors = () => {
        return formErrors.formErrorCode.length > 0 || Object.keys(formErrors.formBlockErrors || {}).length > 0;
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

    if (isLoading) {
        return <div className={styles.loadingState}>Loading form data...</div>;
    }

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
                        className={`${styles.whiteButtonDisabled} "opacity-100"`}
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
                        className={`${styles.whiteButtonDisabled} "opacity-100"`}
                        onClick={() => handleFormDraft()}
                    >
                        <Save size={18} />
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        onClick={() => handleFormPublish()}
                        className={`${styles.greenButtonDisabled} "opacity-100"`}
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