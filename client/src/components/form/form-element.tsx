"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/react/sortable";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { useFormStore } from "@/store/formBuilderStore";
import { FormElement } from "@/types/formBuilderState";
import { DatePickerComponent } from "@/components/custom/date-picker";
import { Trash2, GripVertical } from "lucide-react";
import FileInputComponent from "../input/file-input";
import FormValidationComponent from "./form-validation";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";

const getInputType = (data: FormElement, formBlockId: string) => {
  switch (data.type) {
    case "long":
      return <LongInputComponent disabled={true} />;
    case "option":
      return <OptionsInputComponent el={data} formBlockId={formBlockId} />;
    case "date":
      return <DatePickerComponent disabled={true} />;
    case "file":
      return <FileInputComponent disabled={true} />;
    default:
      return <DefaultInputComponent disabled={true} />;
  }
};

const FormElementComponent = ({
  id,
  element,
  formBlockId,
  index,
}: {
  id: string;
  element: FormElement;
  formBlockId: string;
  index: number;
}) => {
  const formStore = useFormStore();
  const { updateElementTitle, updateElementSubtitle, deleteElement, formErrors } = formStore;

  // Local state for debounced inputs
  const [localTitle, setLocalTitle] = useState(element.main_title);
  const [localSubtitle, setLocalSubtitle] = useState(element.sub_title);

  // Sync local state when element props change
  useEffect(() => {
    setLocalTitle(element.main_title);
  }, [element.main_title]);

  useEffect(() => {
    setLocalSubtitle(element.sub_title);
  }, [element.sub_title]);

  // Debounced update functions
  const debouncedUpdateTitle = useMemo(
    () => debounce((value: string) => updateElementTitle(id, value, formBlockId), 300),
    [id, formBlockId, updateElementTitle],
  );

  const debouncedUpdateSubtitle = useMemo(
    () => debounce((value: string) => updateElementSubtitle(id, value, formBlockId), 300),
    [id, formBlockId, updateElementSubtitle],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedUpdateTitle.cancel();
      debouncedUpdateSubtitle.cancel();
    };
  }, [debouncedUpdateTitle, debouncedUpdateSubtitle]);

  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group: formBlockId,
    type: "form-element",
    accept: "form-element",
    data: { formBlockId },
  });

  return (
    <motion.div
      ref={ref}
      layout
      className={cn(
        "w-full flex flex-col justify-center items-center gap-1 rounded-xl p-4 touch-auto relative mt-4 last:mb-4 transition-colors",
        formErrors.formElementErrors[id]
          ? "border-[2px] border-red-200 bg-red-50"
          : "border-[1px] border-gray-200 bg-white hover:bg-gray-50",
        isDragging ? "opacity-50" : "opacity-100",
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, layout: { duration: 0.2 } }}
    >
      <div className="w-full flex justify-between items-start gap-2">
        <div className="flex-1 flex-col justify-center items-center gap-1">
          <input
            placeholder="Write a question"
            className="w-full bg-transparent text-[15px] text-gray-950 font-[600] leading-5 border-none outline-none"
            value={localTitle}
            onChange={(e) => {
              setLocalTitle(e.target.value);
              debouncedUpdateTitle(e.target.value);
            }}
          />
          <input
            placeholder="Write a help text or caption (optional)."
            className="w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none overflow-y-hidden resize-none"
            value={localSubtitle}
            onChange={(e) => {
              setLocalSubtitle(e.target.value);
              debouncedUpdateSubtitle(e.target.value);
            }}
          />
        </div>
        <div className="flex justify-center items-center gap-2">
          <FormDropdownComponent id={id} element={element} formBlockId={formBlockId} />
          <button className="opacity-50 touch-none" onClick={() => deleteElement(id, formBlockId)}>
            <Trash2 size={18} />
          </button>
          <button ref={handleRef} className="opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing">
            <GripVertical size={18} />
          </button>
        </div>
      </div>
      <div className="w-full">{getInputType(element, formBlockId)}</div>
      <FormValidationComponent elementId={id} formBlockId={formBlockId} />
    </motion.div>
  );
};

export default FormElementComponent;
