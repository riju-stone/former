import React from "react";
import { motion } from "motion/react";

function LongInputComponent({ id }: { id: string }) {
  return (
    <div className="w-full">
      <motion.textarea
        layoutId={`inputField-${id}`}
        transition={{ duration: 0.1, type: "spring" }}
        className="h-[80px] w-full bg-gray-100 px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg text-[12px] text-gray-950 overflow-y-auto resize-none"
      />
    </div>
  );
}

export default LongInputComponent;
