"use client";

import React from "react";
import { CirclePlus } from "lucide-react"
import { v7 as uuid } from "uuid";
import { motion, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

import { FormElement, useFormStore } from "@/store/formStore";

const styles = {
    builderWrapper:
        "h-[calc(100vh_-_120px)] w-full flex flex-col justify-start items-center gap-6 border-l-[1px] border-r-[1px] border-gray-200 overflow-y-auto p-5",
    reorderContainer: "w-full flex flex-col justify-start items-center gap-8",
    addQuestionContainer: "w-full px-4 py-2 flex justify-center items-center",
    addButton:
        "flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button",
};

const getDefaultFormElement = (): FormElement => {
    return { id: uuid(), type: "short", main_title: "", sub_title: "" };
};

function FormBuilderComponent() {
    const formStore = useFormStore();
    const { formElements, addElement } = formStore;

    const handleAddFormElement = () => {
        const el = getDefaultFormElement();
        addElement([...formElements, el]);
    };

    return (
        <div className={styles.builderWrapper}>
            <Reorder.Group as="div" axis="y"
                className="w-full"
                values={formElements}
                onReorder={(els) => addElement(els)}>
                {formElements.map((element) => {
                    return <FormElementComponent
                        key={element.id}
                        id={element.id}
                        element={element}
                    />
                })}
            </Reorder.Group>
            <motion.div
                layout="position"
                transition={{ duration: 0.15 }}
                className={styles.addQuestionContainer}
            >
                <button
                    className={styles.addButton}
                    onClick={() => handleAddFormElement()}
                >
                    <CirclePlus size={18} /> Add Question
                </button>
            </motion.div>
        </div>
    );
}

export default FormBuilderComponent;
