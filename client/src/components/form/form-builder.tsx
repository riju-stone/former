"use client";

import React from "react";

import Plus from "@/assets/icons/plus.svg";
import Image from "next/image";
import { v7 as uuid } from "uuid";
import { motion } from "motion/react";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import FormElementComponent from "./form-element";

import { FormElement, useFormStore } from "@/store/formStore";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

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

    const dragSensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
        useSensor(TouchSensor),
    );

    const handleAddFormElement = () => {
        const el = getDefaultFormElement();
        addElement([...formElements, el]);
    };

    const handleItemSwap = (active, over) => {
        const oldIndex = formElements.findIndex((el) => el.id === active.id);
        const newIndex = formElements.findIndex((el) => el.id === over.id);

        return arrayMove(formElements, oldIndex, newIndex);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            const updatedElements = handleItemSwap(active, over);
            addElement(updatedElements);
        }
    };

    return (
        <div className={styles.builderWrapper}>
            <DndContext
                sensors={dragSensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext
                    items={formElements}
                    strategy={verticalListSortingStrategy}
                >
                    {formElements.map((element) => {
                        return (
                            <FormElementComponent
                                key={element.id}
                                id={element.id}
                                element={element}
                            />
                        );
                    })}
                </SortableContext>
            </DndContext>
            <motion.div
                layout
                transition={{ duration: 0.1 }}
                className={styles.addQuestionContainer}
            >
                <button
                    className={styles.addButton}
                    onClick={() => handleAddFormElement()}
                >
                    <Image src={Plus} alt="add question" /> Add Question
                </button>
            </motion.div>
        </div>
    );
}

export default FormBuilderComponent;
