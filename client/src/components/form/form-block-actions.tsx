"use client";

import { FormElement, useFormStore } from "@/store/formBuilderStore";
import { FormTypes } from "@/types/formMetadata";
import { v7 as uuid } from "uuid";
import { Grab, PlusIcon, Trash2 } from "lucide-react";
import React from "react";
import { motion } from "motion/react";

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

function FormBlockActionComponent({
  step,
  title,
  dragRef,
}: {
  step: string;
  title: string;
  dragRef?: React.Ref<HTMLButtonElement>;
}) {
  const { addElement, updateFormBlockTitle, deleteFormBlock } = useFormStore();

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
    <div className=" w-full z-5 flex justify-between items-center" key={`form-block-actions-${step}`}>
      <div className="relative flex-1 flex justify-center items-center gap-2 p-2 bg-white/50 backdrop-blur-md">
        <input
          id="form-block-title"
          className={`text-[16px] w-[75%] font-[600] bg-transparent border-none outline-none`}
          type="text"
          placeholder="Untitled block"
          onChange={(e) => handleUpdateFormBlockTitle(e.target.value)}
          value={title}
        />
        <motion.div
          className="flex justify-center items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, staggerChildren: 0.1 }}
        >
          <motion.button
            className="flex justify-center items-center py-[6px] px-2 bg-white border-[2px] border-gray-200 rounded-xl font-[600] text-[10px] shadow-button"
            onClick={() => handleAddFormElement(step)}
            whileHover={{ scale: 1.1, borderColor: "#3b82f6" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div animate={{ rotate: 0 }} whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
              <PlusIcon size={15} />
            </motion.div>
          </motion.button>
          <motion.button
            className="flex justify-center items-center py-[6px] px-2 bg-red-100 border-[2px] border-red-200 rounded-xl font-[600] text-[10px] text-red-500 shadow-button"
            onClick={() => handleDeleteFormStepBlock(step)}
            whileHover={{ scale: 1.1, backgroundColor: "#fecaca", borderColor: "#ef4444" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <Trash2 size={15} />
          </motion.button>
          <motion.button
            className="flex justify-center items-center py-[6px] px-2 bg-gray-100 border-[2px] border-gray-200 rounded-xl font-[600] text-[10px] text-gray-500 shadow-button cursor-grab"
            ref={dragRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95, cursor: "grabbing" }}
            transition={{ duration: 0.15 }}
          >
            <Grab size={15} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default FormBlockActionComponent;
