import { FormElement, useFormStore } from '@/store/formBuilderStore';
import { FormTypes } from '@/types/formMetadata';
import { v7 as uuid } from "uuid";
import { PlusIcon, Trash2 } from 'lucide-react'
import React from 'react'

const getDefaultFormElement = (): FormElement => {
  return {
    id: uuid(),
    type: "short",
    main_title: "",
    sub_title: "",
    constraints: [...FormTypes.find((ft) => ft.tag === "short")!.validations].map((val) => ({
      id: uuid(),
      type: val.type,
      name: val.name,
      defaultValue: val.defaultValue.toString(),
      customValue: null,
    })),
  };
};

function FormBlockActionComponent({ step, title }: { step: string, title: string }) {
  const { addElement, updateFormBlockTitle, deleteFormBlock } = useFormStore()

  const handleAddFormElement = (step: string) => {
    const el = getDefaultFormElement();
    addElement([el], step);
  };

  const handleUpdateFormBlockTitle = (title: string) => {
    updateFormBlockTitle(title, step);
  };

  const handleDeleteFormStepBlock = (step: string) => {
    deleteFormBlock(step);
  };

  return (
    <div className='sticky top-0 left-0 w-full z-50 flex justify-between items-center'
      key={`form-block-actions-${step}`}>
      <div className='relative flex-1 flex justify-center items-center gap-2 p-2 bg-white/70 backdrop-blur-md'>
        <input
          id="form-block-title"
          className={`text-[16px] w-[75%] font-[600] bg-transparent border-none outline-none`}
          type="text"
          placeholder="Untitled block"
          onChange={(e) => handleUpdateFormBlockTitle(e.target.value)}
          value={title}
        />
        <div className='flex justify-center items-center gap-2'>
          <button className='flex justify-center items-center py-[6px] px-2 bg-white border-[2px] border-gray-200 rounded-xl font-[600] text-[10px] shadow-button hover:scale-110 transition-all duration-200'
            onClick={() => handleAddFormElement(step)} >
            <PlusIcon size={15} />
          </button>
          <button className='flex justify-center items-center py-[6px] px-2 bg-red-100 border-[2px] border-red-200 rounded-xl font-[600] text-[10px] text-red-500 shadow-button hover:scale-110 transition-all duration-200'
            onClick={() => handleDeleteFormStepBlock(step)}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div >
  )
}

export default FormBlockActionComponent