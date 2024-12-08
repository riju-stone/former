"use client";

import React from "react";

import Plus from "@/assets/icons/plus.svg";
import Image from "next/image";
import { v4 as uuid } from "uuid";
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
    "h-[calc(100vh_-_120px)] w-full flex flex-col justify-start items-center gap-10 border-l-[1px] border-r-[1px] border-gray-200 overflow-y-auto p-5",
  reorderContainer: "w-full flex flex-col justify-start items-center gap-8",
  addQuestionContainer: "w-full px-4 py-2 flex justify-center items-center",
  addButton:
    "flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button",
};

const getDefaultFormElement = (): FormElement => {
  return { id: uuid(), type: "short" };
};

function FormBuilderComponent() {
  const fElements = useFormStore((state) => state.formElements);
  const addFormElements = useFormStore((state) => state.addElement);

  const dragSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor),
  );

  const handleAddFormElement = () => {
    const el = getDefaultFormElement();
    addFormElements([...fElements, el]);
  };

  const handleItemSwap = (active, over) => {
    const oldIndex = fElements.findIndex((el) => el.id === active.id);
    const newIndex = fElements.findIndex((el) => el.id === over.id);

    return arrayMove(fElements, oldIndex, newIndex);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const updatedElements = handleItemSwap(active, over);
      addFormElements(updatedElements);
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
          items={fElements}
          strategy={verticalListSortingStrategy}
        >
          {fElements.map((element) => {
            return <FormElementComponent key={element.id} id={element.id} />;
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
