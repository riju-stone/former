import React from "react";
import { motion } from "motion/react";
import { FormElement } from "@/store/formStore";

function DefaultInputComponent({ el }: { el: FormElement }) {
  return (
    <div className="w-full">
      <motion.input
        layoutId={`inputField-${el.id}`}
        transition={{ duration: 0.1, type: "spring" }}
        className="h-[32px] w-full bg-gray-100 px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
      />
    </div>
  );
}

export default DefaultInputComponent;
