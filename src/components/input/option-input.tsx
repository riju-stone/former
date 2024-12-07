import React, { useState } from "react";

import Uncheck from "@/assets/icons/uncheck.svg";
import Image from "next/image";
import Plus from "@/assets/icons/plus.svg";
import { AnimatePresence, motion } from "motion/react";

function Option() {
  return (
    <AnimatePresence>
      <motion.div
        className="w-full flex justify-center items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Image src={Uncheck} alt="checkbox" />
        <input
          type="text"
          placeholder="option 1"
          className="h-[32px] flex-1 px-2 py-[6px] border-[1px] outline-none bg-white border-gray-200 rounded-lg text-[14px] text-gray-950 font-[400]"
        />
      </motion.div>
    </AnimatePresence>
  );
}

function OptionsInputComponent() {
  const [options, setOptions] = useState([]);

  const handleAddOption = (option) => {
    setOptions([...options, option]);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {options.map((opt, index) => {
        return (
          <motion.div
            key={`option=${index}`}
            className="w-full flex justify-center items-center gap-2"
          >
            {opt}
            {index == options.length - 1 ? (
              <button onClick={() => handleAddOption(<Option />)}>
                <Image src={Plus} alt="add" />
              </button>
            ) : null}
          </motion.div>
        );
      })}
      {options.length == 0 ? (
        <div
          key={`option=-1`}
          className="w-full flex justify-center items-center gap-2"
        >
          <Option />
          <button onClick={() => handleAddOption(<Option />)}>
            <Image src={Plus} alt="add" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default OptionsInputComponent;
