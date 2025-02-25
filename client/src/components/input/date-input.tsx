import React from "react";
import { DatePickerComponent } from "../custom/date-picker";

function DateInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <DatePickerComponent
            disabled={disabled}
            className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
        />
    );
}

export default DateInputComponent;
