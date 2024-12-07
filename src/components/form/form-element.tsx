"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Drag from "@/assets/icons/drag.svg";
import DownArrow from "@/assets/icons/downarrow.svg";
import Image from "next/image";
import FormDropdownComponent from "./form-dropdown";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import OptionsInputComponent from "@/components/input/option-input";
import { FormElement } from "@/store/formStore";

const getInputType = (type: string) => {
  switch (type) {
    case "short":
      return <DefaultInputComponent />;
    case "long":
      return <LongInputComponent />;
    case "option":
      return <OptionsInputComponent />;
    default:
      return <DefaultInputComponent />;
  }
};

function FormElementComponent({ el }: { el: FormElement }) {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-2 bg-white border-[1px] border-gray-200 rounded-xl hover:bg-gray-50 p-4">
      <div className="w-full flex justify-between items-center gap-2">
        <div className="flex-1 flex-col justify-center items-start gap-1">
          <input
            placeholder="Write a question"
            className="w-full bg-transparent text-[14px] text-gray-950 font-[600] leading-5 border-none outline-none"
          />
          <input
            placeholder="Write a help text or caption (leave empty if not needed)."
            className="w-full bg-transparent text-[12px] font-[400] text-gray-950 border-none outline-none"
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
              element={el}
              open={isMenuOpen}
              setMenuOpen={setMenuOpen}
            />
          </div>
          <button className="opacity-50 h-[24px] w-[24px]">
            <Image src={Drag} alt="drag" />
          </button>
        </div>
      </div>
      {getInputType(el.type)}
    </div>
  );
}

export default FormElementComponent;
