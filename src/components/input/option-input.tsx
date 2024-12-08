import React, { useEffect, useState } from "react";

import Uncheck from "@/assets/icons/uncheck.svg";
import Image from "next/image";
import Plus from "@/assets/icons/plus.svg";
import { AnimatePresence, motion } from "motion/react";
import { useFormStore } from "@/store/formStore";

function OptionsInputComponent({ id }: { id: string }) {
  const formElements = useFormStore((state) => state.formElements);
  const currentElement = formElements.find((el) => el.id === id);
  const addOption = useFormStore((state) => state.addOption);

  const handleAddOption = () => {
    const newOption = {
      id: `${currentElement.options.length + 1}`,
      value: `Option ${currentElement.options.length + 1}`,
    };
    addOption(id, newOption);
  };

  return (
    <motion.div
      layoutId={`inputField-${id}`}
      transition={{ duration: 0.1, type: "spring" }}
      className="w-full flex flex-col gap-2"
    >
      {currentElement.options.map((op, index) => {
        return (
          <motion.div
            key={`option-${index}`}
            className="w-full flex justify-center items-center gap-2"
          >
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
                  placeholder={op.value}
                  className="h-[32px] flex-1 px-2 py-[6px] border-[1px] outline-none bg-white border-gray-200 rounded-lg text-[14px] text-gray-950 font-[400]"
                />
              </motion.div>
            </AnimatePresence>
            {index == currentElement.options.length - 1 ? (
              <button onClick={() => handleAddOption()}>
                <Image src={Plus} alt="add" />
              </button>
            ) : null}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default OptionsInputComponent;
