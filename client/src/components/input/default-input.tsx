import React from "react";
import { motion } from "motion/react";

function DefaultInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <div className="w-full">
            <motion.input
                disabled={disabled}
                transition={{ duration: 0.1, type: "spring" }}
                className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
            />
        </div>
    );
}

export default DefaultInputComponent;
