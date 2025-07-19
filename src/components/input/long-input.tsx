import React from "react";
import { FormElement } from "@/store/formStore";

function LongInputComponent({ disabled }: { disabled: boolean }) {
    return (
        <textarea
            disabled={disabled}
            className="h-[80px] w-full bg-transparent px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg text-[12px] text-gray-950 overflow-y-auto resize-none"
        />
    );
}

export default LongInputComponent;