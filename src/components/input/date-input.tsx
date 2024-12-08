import React from "react";
import { motion } from "motion/react";
import { FormElement } from "@/store/formStore";
import Image from "next/image";
import Calendar from "@/assets/icons/calendar.svg";
import { DatePickerComponent } from "../custom/date-picker";

function DateInputComponent({ el }: { el: FormElement }) {
  return (
    <div className="w-full">
      <DatePickerComponent
        layoutId={`inputField-${el.id}`}
        type="date"
        transition={{ duration: 0.1, type: "spring" }}
        className="h-[32px] w-full bg-gray-100 px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
      />
    </div>
  );
}

export default DateInputComponent;
