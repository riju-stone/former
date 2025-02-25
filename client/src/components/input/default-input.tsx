import React from "react";
import { FormElement } from "@/store/formStore";

function DefaultInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <input
            disabled={disabled}
            className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
        />
    );
}

export default DefaultInputComponent;
