"use client";

import React from "react";
import { CirclePlus } from "lucide-react"
import { v7 as uuid } from "uuid";
import { motion, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

import { useFormStore } from "@/store/formStore";
import { FormElement } from "@/types/formState";

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
        <div className="w-screen flex justify-center items-center">
            <div className="h-[calc(100vh-135px)] w-full max-w-[600px] flex flex-col justify-start items-center gap-6 border-[1px] border-gray-200 overflow-y-auto p-5 rounded-md mx-2">
                <Reorder.Group as="div" axis="y"
                    className="w-full"
                    values={formElements}
                    onReorder={addElement}>
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
                    className="w-full px-4 py-2 flex justify-center items-center"
                >
                    <button
                        className="flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button"
                        onClick={() => handleAddFormElement()}
                    >
                        <CirclePlus size={18} /> Add Question
                    </button>
                </motion.div>
            </div >
        </div>
    );
}

export default FormBuilderComponent;
