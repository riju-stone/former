"use client";

import React from "react";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { useFormStore } from "@/store/formStore";
import { FormElement } from "@/types/formState";
import DateInputComponent from "../input/date-input";
import { Trash2, GripVertical } from "lucide-react"
import FileInputComponent from "../input/file-input";
import FormValidationComponent from "./form-validation";

const getInputType = (data: FormElement) => {
    switch (data.type) {
        case "long":
            return <LongInputComponent disabled={true} />;
        case "option":
            return <OptionsInputComponent el={data} />;
        case "date":
            return <DateInputComponent disabled={true} />;
        case "file":
            return <FileInputComponent disabled={true} />;
        default:
            return <DefaultInputComponent disabled={true} />;
    }
};

const FormElementComponent = ({ id, element }: { id: string, element: FormElement }) => {
    const formStore = useFormStore();
    const { updateElementTitle, updateElementSubtitle, deleteElement, formErrors } = formStore;
    const dragControls = useDragControls()

    return (
        <Reorder.Item as="div"
            className="relative w-full my-4"
            value={element}
            dragControls={dragControls}
            dragListener={false}
        >
            <AnimatePresence>
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25, type: "spring" }}
                    layout={true}
                    layoutId={`formElement-${id}`}
                >
                    <div
                        className={`w-full flex flex-col justify-center items-center gap-2 rounded-xl p-4 touch-auto ${formErrors.formBlockErrors[id] ? "border-[2px] border-red-200 bg-red-50" : "border-[1px] border-gray-200 bg-white hover:bg-gray-50"}`}
                    >
                        <div className="w-full flex justify-between items-start gap-2">
                            <div className="flex-1 flex-col justify-center items-center gap-1">
                                <input
                                    placeholder="Write a question"
                                    className="w-full bg-transparent text-[15px] text-gray-950 font-[600] leading-5 border-none outline-none"
                                    value={element.main_title}
                                    onChange={(e) => updateElementTitle(id, e.target.value)}
                                />
                                <input
                                    placeholder="Write a help text or caption (optional)."
                                    className="w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none overflow-y-hidden resize-none"
                                    value={element.sub_title}
                                    onChange={(e) => updateElementSubtitle(id, e.target.value)}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-2">
                                <FormDropdownComponent
                                    id={id}
                                    element={element}
                                />
                                <button className="opacity-50 touch-none"
                                    onClick={() => deleteElement(id)}>
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onPointerDown={(e) => dragControls.start(e)}
                                    className="opacity-50 touch-none cursor-grab"
                                >
                                    <GripVertical size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="w-full">
                            {getInputType(element)}
                        </div>
                        <FormValidationComponent inputType={element.type} />
                    </div>
                </motion.div >
            </AnimatePresence>
        </Reorder.Item >

    );
}

export default FormElementComponent;
