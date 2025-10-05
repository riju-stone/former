"use client";

import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useState } from "react";
import { useFormStore } from "@/store/formBuilderStore";
import ValidationGroupComponent from "@/components/custom/validation-group";

function FormValidationComponent({ elementId }: { elementId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { constraints } = useFormStore((state) =>
    state.formBuilderData.find((el) => el.id === elementId)
  );

  return constraints.length > 0 ? (
    <div className="w-full text-gray-650 text-[12px] font-[600]">
      <div className="flex flex-col items-start gap-2">
        <div
          className="w-full flex items-center gap-2 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="text-gray-500 text-[14px] font-[500]">
            Constraints
          </span>
          <motion.div
            className="flex justify-center items-center opacity-50"
            initial={{ rotateZ: 0 }}
            animate={isExpanded ? { rotateZ: 180 } : { rotateZ: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </div>
        <div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2">
                    <ValidationGroupComponent
                      validationGroup={constraints}
                      elementId={elementId}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  ) : null;
}

export default FormValidationComponent;
