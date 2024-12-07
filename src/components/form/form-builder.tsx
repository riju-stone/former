"use client";

import React from "react";

import Plus from "@/assets/icons/plus.svg";
import Image from "next/image";
import { v4 as uuid } from "uuid";
import { Reorder } from "motion/react";
import FormElementComponent from "./form-element";

import { FormElement, useFormStore } from "@/store/formStore";

const styles = {
  builderWrapper:
    "h-[calc(100vh_-_120px)] w-full flex flex-col justify-start items-center gap-10 border-l-[1px] border-r-[1px] border-gray-200 overflow-y-auto p-5",
  reorderContainer: "w-full flex flex-col justify-start items-center gap-8",
  addButton:
    "flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button",
};

const getDefaultFormElement = (): FormElement => {
  return { id: uuid(), type: "short" };
};

function FormBuilderComponent() {
  const fElements = useFormStore((state) => state.formElements);
  const addFormElements = useFormStore((state) => state.addElement);

  const handleAddFormElement = () => {
    const el = getDefaultFormElement();
    addFormElements([...fElements, el]);
  };

  return (
    <div className={styles.builderWrapper}>
      <Reorder.Group
        as="div"
        axis="y"
        className={styles.reorderContainer}
        values={fElements}
        onReorder={addFormElements}
      >
        {fElements.map((element) => {
          return (
            <Reorder.Item
              as="div"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: 30 }}
              transition={{
                duration: 0.4,
              }}
              key={element.id}
              value={element}
              className="w-full"
            >
              <FormElementComponent el={element} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <div className="w-full px-4 py-2 flex justify-center items-center">
        <button
          className={styles.addButton}
          onClick={() => handleAddFormElement()}
        >
          <Image src={Plus} alt="add question" /> Add Question
        </button>
      </div>
    </div>
  );
}

export default FormBuilderComponent;
