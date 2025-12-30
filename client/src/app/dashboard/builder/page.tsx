"use client";

import FormBuilderComponent from "@/components/form/form-builder";
import React from "react";
import { toast } from "sonner";
import { useFormStore } from "@/store/formBuilderStore";
import { FormState } from "@/types/formBuilderState";
import { useRouter } from "next/navigation";
import { Eye, Save, BookCheck, LayoutTemplate } from "lucide-react";
import { saveFormBuildLocally, saveFormDraft, publishForm } from "@/utils/formApiHelper";
import { doesFormHaveErrors } from "@/utils/formBuilderHelper";

function FormBuilderPage() {
  const formStore = useFormStore();
  const { formId, formTitle, formSteps, formBuilderData, formErrors, updateFormTitle, addFormBlock } = formStore;
  const router = useRouter();

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

  const handleFormPublish = async () => {
    if (!doesFormHaveErrors(formErrors)) {
      const res = await publishForm(formObject);
      console.log("Publish response:", res);
      toast.success("Form published successfully");
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  const handleFormPreview = () => {
    if (!doesFormHaveErrors(formErrors)) {
      saveFormBuildLocally(formObject);
      router.push(`/preview/${formId}`);
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  const handleFormDraft = async () => {
    if (!doesFormHaveErrors(formErrors)) {
      const res = await saveFormDraft(formObject);

      console.log("Draft save response:", res);
      router.push("/");
      toast.success("Form build saved successfully");
    } else {
      toast.error("Form has errors. Please fix them first");
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="h-full w-full flex flex-col justify-center items-center gap-2">
        <div
          className={`h-[64px] w-full flex justify-between items-center px-4 mb-2
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
              className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] shadow-button opacity-100 text-nowrap hover:scale-110 transition-all duration-200`}
              onClick={() => handleAddFormBlock()}
            >
              Add Block
              <LayoutTemplate size={18} />
            </button>
            <button
              className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] shadow-button opacity-100 text-nowrap hover:scale-110 transition-all duration-200`}
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
            className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-white border-[1px] border-gray-200 rounded-xl text-[14px] text-gray-950 font-[600] shadow-button opacity-100 hover:scale-110 transition-all duration-200`}
            onClick={() => handleFormDraft()}
          >
            <Save size={18} />
            Save as Draft
          </button>
          <button
            type="submit"
            onClick={() => handleFormPublish()}
            className={`h-[32px] flex justify-center items-center gap-1 py-[8px] px-[16px] bg-green-500 border-[1px] border-green-500 rounded-xl text-[14px] text-white font-[600] shadow-button opacity-100 hover:scale-110 transition-all duration-200`}
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
