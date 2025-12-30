import { useFormStore } from '@/store/formBuilderStore';
import { CopyPlus } from 'lucide-react';
import React from 'react'

function FormBuilderHeaderComponent() {
  const formStore = useFormStore();
  const { formTitle, formErrors, updateFormTitle, addFormBlock, resetFormStore } = formStore;

  const handleAddFormBlock = () => {
    addFormBlock();
  };

  const handleResetForm = () => {
    resetFormStore();
  };

  return (
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
          className="flex justify-center items-center py-[6px] px-2 bg-blue-100 border-[2px] border-blue-300 rounded-xl font-[600] text-[14px] text-blue-500 shadow-button hover:scale-110 transition-all duration-200 text-nowrap gap-2"
          onClick={() => handleAddFormBlock()}
        >
          <CopyPlus size={18} />
          Add Block
        </button>
        <button
          className="flex justify-center items-center py-[6px] px-2 bg-red-100 border-[2px] border-red-300 rounded-xl font-[600] text-[14px] text-red-500 shadow-button hover:scale-110 transition-all duration-200 text-nowrap gap-2"
          onClick={() => handleResetForm()}
        >
          <CopyPlus size={18} />
          Reset Form
        </button>
      </div>
    </div>
  )
}

export default FormBuilderHeaderComponent