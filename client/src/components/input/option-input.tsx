import React, { useState, useEffect, useMemo } from "react";

import { AnimatePresence, motion } from "motion/react";
import { useFormStore } from "@/store/formBuilderStore";
import { FormElement } from "@/types/formBuilderState";

import { SquarePlus, CircleDashed } from "lucide-react";
import { debounce } from "lodash";

function OptionsInputComponent({ el, formBlockId }: { el: FormElement; formBlockId: string }) {
  const formStore = useFormStore();
  const { addOption, updateOption } = formStore;

  // Local state for each option value
  const [localOptions, setLocalOptions] = useState<Record<string, string>>({});

  // Sync local state when options change
  useEffect(() => {
    const optionsMap: Record<string, string> = {};
    el.options?.forEach((opt) => {
      optionsMap[opt.id] = opt.value;
    });
    setLocalOptions(optionsMap);
  }, [el.options]);

  // Debounced update function factory
  const createDebouncedUpdate = useMemo(
    () => (optId: string) => debounce((value: string) => updateOption(el.id, optId, value, formBlockId), 300),
    [el.id, formBlockId, updateOption],
  );

  // Store debounced functions
  const debouncedUpdates = useMemo(() => {
    const updates: Record<string, ReturnType<typeof debounce>> = {};
    el.options?.forEach((opt) => {
      updates[opt.id] = createDebouncedUpdate(opt.id);
    });
    return updates;
  }, [el.options, createDebouncedUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(debouncedUpdates).forEach((fn) => fn.cancel());
    };
  }, [debouncedUpdates]);

  const handleAddOption = () => {
    const newOption = {
      id: `${el.options.length + 1}`,
      value: "",
    };
    addOption(el.id, newOption, formBlockId);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {el.options.map((op, index) => {
        return (
          <motion.div key={`option-${index}`} className="w-full flex justify-center items-center gap-2">
            <AnimatePresence>
              <motion.div
                className="w-full flex justify-center items-center gap-2"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <button className="opacity-50">
                  <CircleDashed size={15} />
                </button>
                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={localOptions[op.id] ?? op.value}
                  onChange={(e) => {
                    setLocalOptions((prev) => ({ ...prev, [op.id]: e.target.value }));
                    debouncedUpdates[op.id]?.(e.target.value);
                  }}
                  className="h-[32px] flex-1 px-2 py-[6px] border-[1px] outline-none bg-transparent hover:bg-white border-gray-200 rounded-lg text-[14px] text-gray-950 font-[400]"
                />
              </motion.div>
            </AnimatePresence>
            {index == el.options.length - 1 ? (
              <button className="opacity-50" onClick={() => handleAddOption()}>
                <SquarePlus size={20} />
              </button>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}

export default OptionsInputComponent;
