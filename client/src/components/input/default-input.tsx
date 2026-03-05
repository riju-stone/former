import React from "react";

type DefaultInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  disabled?: boolean;
};

const DefaultInputComponent = React.forwardRef<HTMLInputElement, DefaultInputProps>(
  ({ disabled, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg ${
          className || ""
        }`}
        {...props}
      />
    );
  },
);

DefaultInputComponent.displayName = "DefaultInputComponent";

export default DefaultInputComponent;
