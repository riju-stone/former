"use client"

import { fetchFormBuild } from '@/db/queries';
import React, { use, useState, useEffect } from 'react'
import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import DateInputComponent from "@/components/input/date-input";
import { FormElement, FormState, FormOption } from "@/types/formState"
import { FormBuild } from '@/types/formBuild';

function renderOptionInput(el: FormElement) {
    return (
        <>
            {el.options.map((opt: FormOption) => {
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
            return <DefaultInputComponent disabled={false} />;
    }
}

function FormSubmitPage({ params }: { params: Promise<{ id: string }> }) {
    const [formData, setFormData] = useState<Partial<FormBuild | null>>(null)
    const { id } = use(params);

    useEffect(() => {
        fetchFormBuild(id).then(data => setFormData(data[0] as FormBuild))
    }, [id])

    console.log(formData)

    return formData ? (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <div className="h-[56px] w-full md:w-[640px] flex justify-between items-center bg-white border-[1px] border-gray-200 px-6">
                <p className="text-[16px] font-[600] leading-[22px]">
                    {formData.formName}
                </p>
            </div>

            <div className="h-[calc(100vh_-_56px)] w-full md:w-[640px] flex flex-col justify-start items-center border-l-[1px] border-r-[1px] border-gray-200 bg-white p-6 gap-10 overflow-y-auto">
                {formData.builderData && formData.builderData.map((element: FormElement) => {
                    console.log(formData)
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
        <div>Loading...</div>
    );
}

export default FormSubmitPage
