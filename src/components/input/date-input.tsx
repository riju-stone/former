import React from "react";
import { DatePickerComponent } from "../custom/date-picker";

function DateInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <DatePickerComponent disabled={disabled} />
    );
}

export default DateInputComponent;
