"use client";

import { useFormStore } from '@/store/formBuilderStore';
import { FormState } from '@/types/formBuilderState';
import { doesFormHaveErrors } from '@/utils/formBuilderHelper';
import { publishForm, saveFormBuildLocally, saveFormDraft } from '@/utils/formApiHelper';
import { ScanEye, Save, Send } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function FormBuilderFooterComponent() {
  const formStore = useFormStore();
  const { formId, formTitle, formBuilderData, formErrors, formSteps } = formStore;
  const router = useRouter();


  const formObject: FormState = {
    formId: formId,
    formTitle: formTitle,
    formBuilderData: formBuilderData,
    formErrors: formErrors,
    formSteps: formSteps,
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
    <div
      className={`bottom-0 h-[64px] w-full flex justify-between items-center bg-[#F6F8FA] bg-opacity-90 border-[1px] border-gray-200 py-4 px-[24px] mt-2
                    ${formErrors.formErrorCode.length == 0
          ? "border-t-[1px] border-gray-200 bg-gray-50"
          : "border-t-[2px] border-red-200 bg-red-50"
        }
                        `}
    >
      <div className="w-fit flex justify-center items-center gap-2">
        <button
          className="flex justify-center items-center py-[6px] px-2 bg-orange-100 border-[2px] border-orange-300 rounded-xl font-[600] text-[14px] text-orange-500 shadow-button hover:scale-110 transition-all duration-200 text-nowrap gap-2"
          onClick={() => handleFormPreview()}
        >
          <ScanEye size={18} />
          Preview
        </button>
      </div>
      <div className="w-fit flex justify-center items-center gap-2">
        <button
          type="submit"
          className="flex justify-center items-center py-[6px] px-2 bg-yellow-100 border-[2px] border-yellow-300 rounded-xl font-[600] text-[14px] text-yellow-500 shadow-button hover:scale-110 transition-all duration-200 text-nowrap gap-2"
          onClick={() => handleFormDraft()}
        >
          <Save size={18} />
          Save Draft
        </button>
        <button
          type="submit"
          onClick={() => handleFormPublish()}
          className="flex justify-center items-center py-[6px] px-2 bg-green-100 border-[2px] border-green-300 rounded-xl font-[600] text-[14px] text-green-500 shadow-button hover:scale-110 transition-all duration-200 text-nowrap gap-2"
        >
          <Send size={18} />
          Publish
        </button>
      </div>
    </div>
  )
}

export default FormBuilderFooterComponent