"use client";

import React, { use, useEffect, useState } from "react";
import FormBuilderComponent from "@/components/form/form-builder";
import { toast } from "sonner";
import { useFormStore } from "@/store/formBuilderStore";
import { FormBuilderData, FormElement, FormState } from "@/types/formBuilderState";
import { useRouter } from "next/navigation";
import { Eye, Save, BookCheck, LayoutTemplate } from "lucide-react";
import { saveFormBuildLocally, saveFormBuild } from "@/lib/formActions";
import { fetchFormBuild } from "@/db/queries";

function FormBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const formStore = useFormStore();
  const { formId, formTitle, formSteps, formBuilderData, formErrors, updateFormTitle, resetFormStore, addElement, addFormBlock } = formStore;

  const router = useRouter();

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        const formData = await fetchFormBuild(id);

        if (Object.keys(formData[0].builderData).length > 0) {
          // Reset the form store first
          resetFormStore();

          // Parse the builder data from JSON string to object
          const builderData = formData[0].builderData as FormBuilderData;

          // Update form title
          updateFormTitle(formData[0].formName);

          // Add form elements
          // Iterate through all steps in builderData and add elements
          Object.entries(builderData).forEach(([stepKey, elements]) => {
            if (Array.isArray(elements)) {
              addElement(elements as Array<FormElement>, stepKey);
            }
          });

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
    formBuilderData: formBuilderData,
    formErrors: formErrors,
    formSteps: formSteps,
  };

  const handleAddFormBlock = () => {
    addFormBlock();
  };

  const checkForFormErrors = () => {
    return (
      formErrors.formErrorCode.length > 0 ||
      Object.keys(formErrors.formBlockErrors || {}).length > 0 ||
      Object.keys(formErrors.formElementErrors || {}).length > 0
    );
  };

  const handleFormPublish = () => {
    if (!checkForFormErrors()) {
      saveFormBuild(formObject);
      router.push("/");
      toast.success("Form published successfully");
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  const handleFormPreview = () => {
    if (!checkForFormErrors()) {
      saveFormBuildLocally(formObject);
      router.push(`/preview/${formId}`);
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  const handleFormDraft = async () => {
    if (!checkForFormErrors()) {
      const res = await fetch("http://localhost:8080/api/form/builder/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData: formObject }),
        credentials: "include",
      }).then((res) => res.json());

      console.log("Draft save response:", res);

      router.push("/");
      toast.success("Form build saved successfully");
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full w-full">Loading form data</div>;
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-full w-full flex flex-col justify-center items-center gap-2">
        <div
          className={`h-[56px] w-full flex justify-between items-center px-4 mb-2
                    ${formErrors.formErrorCode.length == 0
              ? "border-b-[1px] border-gray-200 bg-gray-50"
              : "border-b-[2px] border-red-200 bg-red-50"
            }
                        `}
        >
          <input
            id="form-title"
            className={`text-[16px] w-full font-[600] bg-transparent border-none outline-none mr-2`}
            type="text"
            placeholder="Untitled form"
            value={formTitle}
            onChange={(e) => updateFormTitle(e.target.value)}
          />
          <div className="w-fit flex justify-center items-center gap-2">
            <button
              className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] shadow-button opacity-100 text-nowrap`}
              onClick={() => handleAddFormBlock()}
            >
              Add Block
              <LayoutTemplate size={18} />
            </button>
            <button
              className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] shadow-button opacity-100 text-nowrap`}
              onClick={() => handleFormPreview()}
            >
              Preview
              <Eye size={18} />
            </button>
          </div>
        </div>
        <FormBuilderComponent />
        <div
          className={`bottom-0 h-[64px] w-full flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px] mt-2
                    ${formErrors.formErrorCode.length == 0
              ? "border-t-[1px] border-gray-200 bg-gray-50"
              : "border-t-[2px] border-red-200 bg-red-50"
            }
                        `}
        >
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
