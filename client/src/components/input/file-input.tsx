import { CloudUpload } from "lucide-react";
import React from "react";

function FileInputComponent({ disabled }: { disabled: boolean }) {
  return (
    <div className="w-full h-[32px] bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg">
      <input type="file" className="hidden" disabled={disabled} placeholder="Upload a file" />
      <label htmlFor="file-input" className="w-full h-full flex justify-center items-center gap-2">
        <CloudUpload className="opacity-50" size={18} />
      </label>
    </div>
  );
}

export default FileInputComponent;
