"use client";

import React, { memo } from "react";
import FormBlockActionComponent from "./form-block-actions";
import { useFormStore } from "@/store/formBuilderStore";
import FormElementComponent from "./form-element";
import { AnimatePresence, motion } from "motion/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { closestCenter } from "@dnd-kit/collision";
import type { FormElement } from "@/types/formBuilderState";
import { cn } from "@/lib/utils";

const FormBlockComponent = memo(function FormBlockComponent({
  id,
  index,
  elements,
}: {
  id: string;
  index: number;
  elements: FormElement[];
}) {
  const { formErrors, formBuilderData } = useFormStore();

  const { ref, handleRef } = useSortable({
    id,
    index,
    type: "form-block",
    // Accept both blocks (for reorder) and elements (for drop-on-empty-block)
    accept: ["form-block", "form-element"],
    // High priority so blocks are preferred targets when they overlap
    collisionPriority: CollisionPriority.Lowest,
    collisionDetector: closestCenter,
  });

  if (!formBuilderData[id]) {
    return null;
  }

  const hasElements = elements.length > 0;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.2, layout: { duration: 0.2 } }}
      className={cn(
        "h-max w-[400px] min-w-[400px] max-w-[400px] flex flex-col justify-start items-center mx-1 relative rounded-xl",
        formErrors.formBlockErrors[id]
          ? "border-[2px] border-red-200 bg-red-50"
          : "border-[1px] border-gray-200 bg-white hover:bg-gray-50g",
      )}
    >
      <FormBlockActionComponent step={id} title={formBuilderData[id].formBlockTitle} dragRef={handleRef} />
      <div className={cn("w-full px-3", !hasElements && "min-h-[100px] flex items-center justify-center")}>
        {!hasElements && <p className="text-gray-400 text-sm">Add or Drop Form Elements</p>}
        <AnimatePresence mode="popLayout">
          {elements.map((element: FormElement, idx: number) => (
            <FormElementComponent key={element.id} id={element.id} element={element} formBlockId={id} index={idx} />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

export default FormBlockComponent;
