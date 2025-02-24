import React from "react";
import { motion } from "motion/react";
import { FormElement } from "@/store/formStore";

function DefaultInputComponent({ el, disabled }: { el: FormElement, disabled: boolean }) {
    return (
        <motion.div layoutId={`inputField-${el.id}`} className="w-full" transition={{ duration: 0.02, type: "spring" }}>
            <motion.input
                disabled={disabled}
                className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
            />
        </motion.div>
    );
}

export default DefaultInputComponent;
