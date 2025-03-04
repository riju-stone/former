"use client";

import React from "react";
import { AnimatePresence, motion, Reorder, useDragControls } from "motion/react";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { FormElement, useFormStore } from "@/store/formStore";
import DateInputComponent from "../input/date-input";
import { Trash2, GripVertical } from "lucide-react"

const styles = {
    formElementWrapper:
        "w-full flex flex-col justify-center items-center gap-2 bg-white rounded-xl hover:bg-gray-50 p-4 touch-auto",
    formNormalElementBorder: "border-[1px] border-gray-200",
    formErrorElementBorder: "border-[2px] border-red-300",
    formElementHeaderContainer: "w-full flex justify-between items-start gap-2",
    formElementTitleContainer: "flex-1 flex-col justify-center items-center gap-1",
    formElementTitle:
        "w-full bg-transparent text-[15px] text-gray-950 font-[600] leading-5 border-none outline-none",
    formElementSubtitle:
        "w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none overflow-y-hidden resize-none",
};

const getInputType = (data: FormElement) =>
{
    switch (data.type)
    {
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

const FormElementComponent = ({ id, element }: { id: string, element: FormElement }) =>
{
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
                        className={`${styles.formElementWrapper} ${formErrors.formBlockErrors[id] ? styles.formErrorElementBorder : styles.formNormalElementBorder}`}
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
                    </div>
                </motion.div >
            </AnimatePresence>
        </Reorder.Item >

    );
}

export default FormElementComponent;
