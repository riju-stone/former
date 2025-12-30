"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

import { useFormStore } from "@/store/formBuilderStore";
import FormBlockActionComponent from "./form-block-actions";
import { FormElement } from "@/types/formBuilderState";

function FormBuilderComponent() {
  const formStore = useFormStore();
  const { formBuilderData, formSteps, setElements, formErrors } = formStore;

  return (
    <div className="h-full w-full overflow-x-scroll overflow-y-hidden">
      <div className="h-full w-[fit-content] flex justify-center items-center overflow-y-hidden">
        <AnimatePresence>
          {Object.keys(formBuilderData).map((key) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, type: "spring" }}
              layout={true}
              key={key}
              className={`h-full w-[450px] flex flex-col justify-start items-center overflow-y-auto rounded-md mx-2 my-1 overflow-x-hidden overscroll-none ${formErrors.formBlockErrors[key]
                ? "border-[2px] border-red-200 bg-red-50"
                : "border-[1px] border-gray-200 bg-white hover:bg-gray-50"
                }`}
            >
              {formBuilderData[key] && (
                <React.Fragment>
                  <FormBlockActionComponent step={key} title={formBuilderData[key].formBlockTitle} />
                  <Reorder.Group
                    as="div"
                    axis="y"
                    className="w-full px-4"
                    values={formBuilderData[key].formBlockElements}
                    onReorder={(newOrder) => setElements(newOrder as Array<FormElement>, key)}
                  >
                    {formBuilderData[key].formBlockElements.map((element: FormElement) => {
                      return <FormElementComponent key={element.id} id={element.id} element={element} formBlockId={key} />;
                    })}
                  </Reorder.Group>
                </React.Fragment>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FormBuilderComponent;
