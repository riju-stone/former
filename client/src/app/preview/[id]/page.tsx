"use client";

import React, { use, useEffect, useState } from "react";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import { DatePickerComponent } from "@/components/custom/date-picker";
import { FormElement, FormState, FormOption } from "@/store/formBuilderStore";
import { FORM_ERROR_TYPES } from "@/utils/formBuilderHelper";
import { FormBuilderData } from "@/types/formBuilderState";

function renderOptionInput(el: FormElement) {
  return (
    <>
      {el.options.map((opt: FormOption) => {
        return (
          <div key={opt.id}>
            <input type="radio" name={el.id} id={opt.value} value={opt.value} disabled={false} />
            <label htmlFor={opt.value} className="ml-2">
              {opt.value}
            </label>
          </div>
        );
      })}
    </>
  );
}

function renderInputType(type: string) {
  switch (type) {
    case "short":
      return <DefaultInputComponent disabled={true} />;
    case "long":
      return <LongInputComponent disabled={true} />;
    case "date":
      return <DatePickerComponent disabled={true} />;
    default:
      return <DefaultInputComponent disabled={true} />;
  }
}

function FormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState<FormState>({
    formTitle: "",
    formBuilderData: {
      "form-block-1": {
        formBlockTitle: "Form Block 1",
        formBlockElements: [],
      },
    },
    formId: "",
    formErrors: {
      formId: "",
      formErrorCode: null,
      formElementErrors: {},
      formBlockErrors: {
        "form-block-1": [FORM_ERROR_TYPES.EMPTY_FORM_BLOCK],
      },
    },
    formSteps: 1,
  });
  const { id } = use(params);

  useEffect(() => {
    let data = localStorage.getItem(`form-build-${id}`) || "{}";
    const parsedData = JSON.parse(data) as FormState;
    setFormData(parsedData);
  }, []);

  return Object.values(formData.formBuilderData).length > 0 ? (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="h-[56px] w-full md:w-[640px] flex justify-between items-center bg-white border-[1px] border-gray-200 px-6">
        <p className="text-[16px] font-[600] leading-[22px]">{formData.formTitle}</p>
      </div>

      <div className="h-full w-full md:w-[640px] flex flex-col justify-start items-center border-l-[1px] border-r-[1px] border-gray-200 bg-white p-6 gap-10 overflow-y-auto">
        {Object.values(formData.formBuilderData).map((formBlock: FormBuilderData) => {
          return (
            <div className="w-full border-[1px] rounded-md p-5 flex flex-col gap-2" key={`form-block-${formBlock.formBlockTitle}`}>
              <p className="text-[20px] font-[600] mb-4">{formBlock.formBlockTitle}</p>
              {formBlock.formBlockElements.map((element: FormElement) => {
                return (
                  <div key={`form-element-${element.id}`} className="w-full flex flex-col gap-1 mb-5">
                    <label className="text-[16px] text-gray-950 font-[600] leading-5">{element.main_title}</label>
                    <p className="text-[12px] text-gray-700">{element.sub_title}</p>
                    {element.type !== "option" ? renderInputType(element.type) : renderOptionInput(element)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="h-screen w-screen flex flex-col justify-center items-center">No Data</div>
  );
}

export default FormPreviewPage;
