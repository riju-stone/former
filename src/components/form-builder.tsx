"use client";

import React, { useId, useState } from "react";

import Plus from "@/assets/icons/plus.svg";
import Image from "next/image";
import { AnimatePresence, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

function FormBuilderComponent() {
  const [formElements, setFormElements] = useState([]);

  const addFormElement = () => {
    console.log(formElements);
    const defaultElement = {
      formType: "short",
    };

    const currFormElements = formElements;
    currFormElements.push(defaultElement);
    setFormElements(currFormElements);
  };

  return (
    <div className="h-[calc(100vh_-_120px)] w-full flex flex-col justify-start items-center gap-10 border-l-[1px] border-r-[1px] border-gray-200 overflow-y-auto p-5">
      {/* <Reorder.Group */}
      {/*   axis="y" */}
      {/*   as="div" */}
      {/*   values={formElements} */}
      {/*   onReorder={setFormElements} */}
      {/* > */}
      {/*   <AnimatePresence> */}
      {/*     {formElements.map((element, index) => { */}
      {/*       return ( */}
      {/*         <Reorder.Item */}
      {/*           key={`reorder-item-${index}`} */}
      {/*           value={element} */}
      {/*           className="list-none" */}
      {/*         > */}
      {/*           <FormElementComponent /> */}
      {/*         </Reorder.Item> */}
      {/*       ); */}
      {/*     })} */}
      {/*   </AnimatePresence> */}
      {/* </Reorder.Group> */}
      <FormElementComponent type="short" />
      <FormElementComponent type="long" />
      <FormElementComponent type="select" />
      <div className="w-full px-4 py-2 flex justify-center items-center">
        <button
          className="flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[1px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button"
          onClick={() => addFormElement()}
        >
          <Image src={Plus} alt="add question" /> Add Question
        </button>
      </div>
    </div>
  );
}

export default FormBuilderComponent;
