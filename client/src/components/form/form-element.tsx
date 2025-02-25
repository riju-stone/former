"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, Reorder } from "motion/react";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { FormElement, useFormStore } from "@/store/formStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DateInputComponent from "../input/date-input";
import { Trash2, GripVertical } from "lucide-react"

const styles = {
    formElementWrapper:
        "w-full flex flex-col justify-center items-center gap-2 bg-white border-[1px] border-gray-200 rounded-xl hover:bg-gray-50 p-4 touch-auto",
    formElementHeaderContainer: "w-full flex justify-between items-start gap-2",
    formElementTitleContainer: "flex-1 flex-col justify-center items-center gap-1",
    formElementTitle:
        "w-full bg-transparent text-[15px] text-gray-950 font-[600] leading-5 border-none outline-none",
    formElementSubtitle:
        "w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none overflow-y-hidden resize-none",
};

const getInputType = (data: FormElement) => {
    switch (data.type) {
        case "long":
            return <LongInputComponent disabled={true} />;
        case "option":
            return <OptionsInputComponent el={data} />;
        case "date":
            return <DateInputComponent disabled={true} />;
        default:
            return <DefaultInputComponent disabled={true} />;
    }
};

const FormElementComponent = ({ id, element }: { id: string, element: FormElement }) => {
    const formStore = useFormStore();
    const { updateElementTitle, updateElementSubtitle } = formStore;

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 999 : 1,
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className="w-full"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.2, type: "spring", ease: "easeInOut" }}
                layout="size"
                layoutId={`formElement-${id}`}
            >
                <div
                    ref={setNodeRef}
                    style={style}
                    className={`${styles.formElementWrapper} ${isDragging ? "shadow-lg" : ""}`}
                >
                    <div className={styles.formElementHeaderContainer}>
                        <div className={styles.formElementTitleContainer}>
                            <input
                                placeholder="Write a question"
                                className={styles.formElementTitle}
                                value={element.main_title}
                                onChange={(e) => updateElementTitle(id, e.target.value)}
                            />
                            <input
                                placeholder="Write a help text or caption (optional)."
                                className={styles.formElementSubtitle}
                                value={element.sub_title}
                                onChange={(e) => updateElementSubtitle(id, e.target.value)}
                            />
                            {element.type == "long" ? <input className={styles.formElementSubtitle} placeholder="Maximum characters" /> : null}
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <FormDropdownComponent
                                id={id}
                                element={element}
                            />
                            <button className="opacity-50 touch-none">
                                <Trash2 size={18} />
                            </button>
                            <button
                                {...attributes}
                                {...listeners}
                                className="opacity-50 touch-none cursor-grab"
                            >
                                <GripVertical size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="w-full">
                        {getInputType(element)}
                    </div>
                </div>
            </motion.div >
        </AnimatePresence >
    );
}

export default FormElementComponent;
