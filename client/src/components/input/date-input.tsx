import React from "react";
import { DatePickerComponent } from "../custom/date-picker";
import { motion } from "motion/react";
import { FormElement } from "@/store/formStore";

function DateInputComponent({ el, disabled }: { el: FormElement, disabled: boolean }) {
    return (
        <motion.div className="w-full" layoutId={`inputField-${el.id}`} transition={{ duration: 0.02, type: "spring" }}>
            <DatePickerComponent
                disabled={disabled}
                className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
            />
        </motion.div>
    );
}

export default DateInputComponent;
