"use client";

import React, { useState } from "react";

import Plus from "@/assets/icons/plus.svg";
import Image from "next/image";
import { AnimatePresence, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

function FormBuilderComponent() {
  const [formElements, setFormElements] = useState([]);

  const getDefaultFormElement = () => {
    return { id: formElements.length + 1, type: "short" };
  };

  const handleAddFormElement = () => {
    const el = getDefaultFormElement();
    setFormElements([...formElements, el]);
  };

  return (
    <div className="h-[calc(100vh_-_120px)] w-full flex flex-col justify-start items-center gap-10 border-l-[1px] border-r-[1px] border-gray-200 overflow-y-auto p-5">
      <Reorder.Group
        axis="y"
        className="w-full flex flex-col justify-start items-center gap-8"
        values={formElements}
        onReorder={setFormElements}
      >
        {formElements.map((element) => {
          return (
            <Reorder.Item
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 1, y: 30 }}
              transition={{
                duration: 0.4,
              }}
              key={element.id}
              value={element}
              className="list-none w-full"
            >
              <FormElementComponent type={element.type} />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <div className="w-full px-4 py-2 flex justify-center items-center">
        <button
          className="flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button"
          onClick={() => handleAddFormElement()}
        >
          <Image src={Plus} alt="add question" /> Add Question
        </button>
      </div>
    </div>
  );
}

export default FormBuilderComponent;
