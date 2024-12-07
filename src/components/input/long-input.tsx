import React from "react";

function LongInputComponent() {
  return (
    <div className="w-full">
      <textarea className="h-[80px] w-full bg-gray-100 px-2 py-[6px] outline-none border-[1px] border-gray-200 rounded-lg text-[12px] text-gray-950 overflow-y-auto resize-none" />
    </div>
  );
}

export default LongInputComponent;
