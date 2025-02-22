import React from "react";
import { motion } from "motion/react";
import { FormElement } from "@/store/formStore";

function LongInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <div className="w-full">
            <motion.textarea
                disabled={disabled}
                transition={{ duration: 0.1, type: "spring" }}
                className="h-[80px] w-full bg-transparent px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg text-[12px] text-gray-950 overflow-y-auto resize-none"
            />
        </div>
    );
}

export default LongInputComponent;
