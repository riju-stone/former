"use client";

import React, { use, useEffect, useState } from "react";
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import DateInputComponent from "@/components/input/date-input";
import { FormElement, Option } from "@/store/formStore";

function renderOptionInput(el: FormElement) {
  return (
    <>
      {el.options.map((opt: Option) => {
        return (
          <div key={opt.id}>
            <input
              type="radio"
              name={el.id}
              id={opt.value}
              value={opt.value}
              disabled={false}
            />
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
      return <DefaultInputComponent disabled={false} />;
    case "long":
      return <LongInputComponent disabled={false} />;
    case "date":
      return <DateInputComponent disabled={false} />;
    default:
      return <DefaultInputComponent disabled={true} />;
  }
}

function FormPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const [formData, setFormData] = useState({});
  const { id } = use(params);

  useEffect(() => {
    let data = localStorage.getItem(`form-build-${id}`) || "{}";
    data = JSON.parse(data);
    setFormData(data);
  }, []);

  return Object.values(formData).length > 0 ? (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="h-[56px] w-full md:w-[640px] flex justify-between items-center bg-white border-[1px] border-gray-200 px-6">
        <p className="text-[16px] font-[600] leading-[22px]">
          {formData.formTitle}
        </p>
      </div>

      <div className="h-[calc(100vh_-_56px)] w-full md:w-[640px] flex flex-col justify-start items-center border-l-[1px] border-r-[1px] border-gray-200 bg-white p-6 gap-10 overflow-y-auto">
        {formData.formElements.map((element: FormElement) => {
          return (
            <div
              key={`form-element-${element.id}`}
              className="w-full flex flex-col gap-1"
            >
              <label className="text-[14px] text-gray-950 font-[600] leading-5">
                {element.main_title}
              </label>
              <p className="text-[12px] text-gray-700">{element.sub_title}</p>
              {element.type !== "option"
                ? renderInputType(element.type)
                : renderOptionInput(element)}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <div>No Data</div>
  );
}

export default FormPreviewPage;
