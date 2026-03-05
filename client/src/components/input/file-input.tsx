import { CloudUpload } from "lucide-react";
import React from "react";

type FileInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  disabled?: boolean;
};

const FileInputComponent = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ disabled, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = props.id ?? `file-input-${generatedId}`;
    return (
      <div
        className={`w-full h-[32px] bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg ${
          className || ""
        }`}
      >
        <label htmlFor={inputId} className="w-full h-full flex justify-center items-center gap-2">
          <CloudUpload className="opacity-50" size={18} />
          <span className="text-[12px] text-gray-500">Upload file</span>
        </label>
        <input
          ref={ref}
          id={inputId}
          type="file"
          disabled={disabled}
          placeholder="Upload a file"
          className="hidden"
          {...props}
        />
      </div>
    );
  },
);

FileInputComponent.displayName = "FileInputComponent";

export default FileInputComponent;
