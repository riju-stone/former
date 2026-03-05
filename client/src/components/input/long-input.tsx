import React from "react";

type LongInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  disabled?: boolean;
};

const LongInputComponent = React.forwardRef<HTMLTextAreaElement, LongInputProps>(
  ({ disabled, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`h-[80px] w-full bg-transparent px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg text-[12px] text-gray-950 overflow-y-auto resize-none ${
          className || ""
        }`}
        {...props}
      />
    );
  },
);

LongInputComponent.displayName = "LongInputComponent";

export default LongInputComponent;
