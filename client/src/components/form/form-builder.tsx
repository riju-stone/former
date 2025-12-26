"use client";

import React from "react";
import { CirclePlus, PlusIcon, Trash2 } from "lucide-react";
import { v7 as uuid } from "uuid";
import { AnimatePresence, motion, Reorder } from "motion/react";
import FormElementComponent from "./form-element";

import { useFormStore } from "@/store/formBuilderStore";
import { FormElement } from "@/types/formBuilderState";
import { FormTypes } from "@/types/formMetadata";

const getDefaultFormElement = (step: number): FormElement => {
  return {
    id: uuid(),
    type: "short",
    main_title: "",
    sub_title: "",
    step: step + 1,
    constraints: [...FormTypes.find((ft) => ft.tag === "short")!.validations].map((val) => ({
      id: uuid(),
      type: val.type,
      name: val.name,
      defaultValue: val.defaultValue.toString(),
      customValue: null,
    })),
  };
};

function FormBuilderComponent() {
  const formStore = useFormStore();
  const { formTitle, formBuilderData, formSteps, updateFormSteps, addElement, formErrors } = formStore;

  const handleAddFormSteps = () => {
    // Not implemented yet
    updateFormSteps(formSteps + 1);
  };

  const handleAddFormElement = (step: number) => {
    const el = getDefaultFormElement(step);
    el.step = step;
    addElement([...formBuilderData[`step${step}`], el], `step${step}`);
  };

  const handleDeleteFormStepBlock = (step: number) => {
    const updatedData = { ...formBuilderData };
    const updatedFormTitle = formTitle;

    // Remove the specified step
    delete updatedData[`step${step}`];
    // Shift subsequent steps up
    for (let i = step + 1; i <= formSteps; i++) {
      if (updatedData[`step${i}`]) {
        updatedData[`step${i - 1}`] = updatedData[`step${i}`].map((el) => ({
          ...el,
          step: el.step - 1,
        }));
        delete updatedData[`step${i}`];
      }
    }

    // Reset Form Store
    formStore.resetFormStore();

    // Apply the updated data using addElement for each step
    formStore.updateFormTitle(updatedFormTitle);
    Object.keys(updatedData).forEach((key) => {
      addElement(updatedData[key], key);
    });
    updateFormSteps(formSteps - 1);
  };

  return (
    <div className="w-full overflow-x-scroll">
      <div className="w-[fit-content] flex justify-center items-center">
        <AnimatePresence>
          {Array.from({ length: formSteps }, (_, i) => i).map((step) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, type: "spring" }}
              layout={true}
              key={step}
              className={`h-[calc(100vh-150px)] max-w-[600px] min-w-[450px] flex flex-col justify-start items-center overflow-y-auto p-5 rounded-md mx-2 my-1 overflow-x-hidden ${
                formErrors.formBlockErrors[`step${step + 1}`]
                  ? "border-[2px] border-red-200 bg-red-50"
                  : "border-[1px] border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <Reorder.Group
                as="div"
                axis="y"
                className="w-full"
                values={formBuilderData[`step${step + 1}`]}
                onReorder={(newOrder) => addElement(newOrder, `step${step + 1}`)}
              >
                {formBuilderData[`step${step + 1}`].map((element) => {
                  return <FormElementComponent key={element.id} id={element.id} element={element} />;
                })}
              </Reorder.Group>
              <motion.div
                layout="position"
                transition={{ duration: 0.15 }}
                className="w-full px-4 py-2 flex justify-center items-center"
              >
                <button
                  className="flex justify-center items-center gap-1 py-[6px] px-4 bg-white border-[2px] border-gray-200 rounded-xl font-[600] text-[14px] shadow-button"
                  onClick={() => handleAddFormElement(step + 1)}
                >
                  <CirclePlus size={18} /> Add Question
                </button>
              </motion.div>
              <motion.div
                layout="position"
                transition={{ duration: 0.15 }}
                className="w-full px-4 py-2 flex justify-center items-center"
              >
                <button
                  className="flex justify-center items-center gap-1 py-[6px] px-4 bg-red-100 border-[2px] border-red-200 rounded-xl font-[600] text-[14px] text-red-500 shadow-button"
                  onClick={() => handleDeleteFormStepBlock(step + 1)}
                >
                  <Trash2 size={18} /> Delete Block
                </button>
              </motion.div>
            </motion.div>
          ))}
          <motion.div
            layout="position"
            transition={{ duration: 0.15 }}
            className="w-full px-4 py-2 flex justify-center items-center"
          >
            <button
              className="h-15 w-15 p-2 mx-8 flex justify-center items-center bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
              onClick={handleAddFormSteps}
            >
              <PlusIcon />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FormBuilderComponent;
