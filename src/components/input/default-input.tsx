import React from "react";
import { motion } from "motion/react";

function DefaultInputComponent({ id }: { id: string }) {
  return (
    <div className="w-full">
      <motion.input
        layoutId={`inputField-${id}`}
        transition={{ duration: 0.1, type: "spring" }}
        className="h-[32px] w-full bg-gray-100 px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg"
      />
    </div>
  );
}

export default DefaultInputComponent;
