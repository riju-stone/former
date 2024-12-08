"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Drag from "@/assets/icons/drag.svg";
import DownArrow from "@/assets/icons/downarrow.svg";
import Image from "next/image";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { FormElement, useFormStore } from "@/store/formStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const styles = {
  formElementWrapper:
    "w-full flex flex-col justify-center items-center gap-2 bg-white border-[1px] border-gray-200 rounded-xl hover:bg-gray-50 p-4",
  formElementHeaderContainer: "w-full flex justify-between items-center gap-2",
  formElementTitleContainer: "flex-1 flex-col justify-center items-start gap-1",
  formElementTitle:
    "w-full bg-transparent text-[14px] text-gray-950 font-[600] leading-5 border-none outline-none",
  formElementSubtitle:
    "w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none",
};

const getInputType = (data: FormElement) => {
  switch (data.type) {
    case "short":
      return <DefaultInputComponent id={data.id} />;
    case "long":
      return <LongInputComponent id={data.id} />;
    case "option":
      return <OptionsInputComponent id={data.id} />;
    default:
      return <DefaultInputComponent id={data.id} />;
  }
};

function FormElementComponent({ id }: { id: string }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const formElements = useFormStore((state) => state.formElements);

  const elementData = formElements.find((el) => el.id === id);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <AnimatePresence>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div
          ref={setNodeRef}
          style={style}
          className={styles.formElementWrapper}
        >
          <div className={styles.formElementHeaderContainer}>
            <div className={styles.formElementTitleContainer}>
              <input
                placeholder="Write a question"
                className={styles.formElementTitle}
              />
              <input
                placeholder="Write a help text or caption (leave empty if not needed)."
                className={styles.formElementSubtitle}
              />
            </div>
            <div className="flex justify-center items-center gap-2">
              <div className="h-[24px] w-[24px] relative aspect-square">
                <button
                  className="h-full w-full"
                  onClick={() => setMenuOpen(!isMenuOpen)}
                >
                  <motion.div
                    className="w-full h-full flex justify-center items-center opacity-50"
                    initial={{ rotateZ: 0 }}
                    animate={isMenuOpen ? { rotateZ: 180 } : { rotateZ: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image src={DownArrow} alt="form-type" />
                  </motion.div>
                </button>
                <FormDropdownComponent
                  id={id}
                  open={isMenuOpen}
                  setMenuOpen={setMenuOpen}
                />
              </div>
              <button
                {...attributes}
                {...listeners}
                className="opacity-50 h-[24px] w-[24px]"
              >
                <Image src={Drag} alt="drag" />
              </button>
            </div>
          </div>
          {getInputType(elementData)}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FormElementComponent;
