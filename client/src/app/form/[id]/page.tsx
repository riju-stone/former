"use client";

import React, { use, useEffect, useMemo, useState } from "react";
import { useForm, type FieldErrors, type Resolver, type UseFormRegister } from "react-hook-form";
import { z } from "zod";

import DefaultInputComponent from "@/components/input/default-input";
import LongInputComponent from "@/components/input/long-input";
import FileInputComponent from "@/components/input/file-input";
import { DatePickerComponent } from "@/components/custom/date-picker";

import { fetchLiveFormData, submitFormResponse } from "@/utils/formApiHelper";
import { FormElement, FormOption } from "@/types/formBuilderState";
import { FormBuild, FormElementConstraint } from "@/types/formBuilderState";
import { useFormLiveStore } from "@/store/formLiveStore";

import { emailSchema, urlSchema, phoneSchema, dateSchema, numberSchema, textSchema, fileSchema } from "@/lib/formValidation";

type SubmissionFormValues = {
  userEmail: string;
} & Record<string, any>;

const MAX_FILE_BYTES = 10 * 1024 * 1024;

const buildConstraintMap = (constraints: FormElementConstraint[]) => {
  const constraintMap: Record<string, string | string[]> = {};
  constraints.forEach((constraint) => {
    constraintMap[constraint.type] = constraint.customValue ?? constraint.defaultValue;
  });
  return constraintMap;
};

const getTextLimits = (constraints: Record<string, string | string[]>, fallbackMax: number) => {
  const minRaw = constraints.min_characters;
  const maxRaw = constraints.max_characters;
  const min = typeof minRaw === "string" && minRaw !== "" ? Number(minRaw) : 0;
  const max = typeof maxRaw === "string" && maxRaw !== "" ? Number(maxRaw) : fallbackMax;
  return {
    min: Number.isFinite(min) ? min : 0,
    max: Number.isFinite(max) ? max : fallbackMax,
  };
};

const getNumberRange = (constraints: Record<string, string | string[]>) => {
  const minRaw = constraints.min_value;
  if (Array.isArray(minRaw)) {
    const [min, max] = minRaw.map((val) => Number(val));
    return {
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 1000000,
    };
  }
  if (typeof minRaw === "string" && minRaw.includes(",")) {
    const [min, max] = minRaw.split(",").map((val) => Number(val));
    return {
      min: Number.isFinite(min) ? min : 0,
      max: Number.isFinite(max) ? max : 1000000,
    };
  }
  return { min: 0, max: 1000000 };
};

const getFileConstraints = (constraints: Record<string, string | string[]>) => {
  const sizeRaw = constraints.max_file_size;
  const sizeMb = typeof sizeRaw === "string" && sizeRaw !== "" ? Number(sizeRaw) : 10;
  const allowedRaw = constraints.allowed_file_types;
  const allowed = Array.isArray(allowedRaw) ? allowedRaw : typeof allowedRaw === "string" ? allowedRaw.split(",") : [];
  return {
    sizeBytes: Number.isFinite(sizeMb) ? sizeMb * 1024 * 1024 : MAX_FILE_BYTES,
    allowed,
  };
};

const FILE_MIME_MAP: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  pdf: "application/pdf",
};

const buildElementSchema = (element: FormElement) => {
  const constraintMap = buildConstraintMap(element.constraints || []);

  switch (element.type) {
    case "short": {
      const { min, max } = getTextLimits(constraintMap, 120);
      return textSchema(min, max);
    }
    case "long": {
      const { min, max } = getTextLimits(constraintMap, 300);
      return textSchema(min, max);
    }
    case "url":
      return urlSchema();
    case "phone":
      return phoneSchema();
    case "date":
      return dateSchema();
    case "number": {
      const { min, max } = getNumberRange(constraintMap);
      return numberSchema(min, max);
    }
    case "file": {
      const { sizeBytes, allowed } = getFileConstraints(constraintMap);
      if (allowed.length > 0) {
        const mimeTypes = allowed
          .map((ext) => FILE_MIME_MAP[ext.toLowerCase()])
          .filter((value): value is string => Boolean(value));
        if (mimeTypes.length > 0) {
          const schemas = mimeTypes.map((mime) => fileSchema(mime, sizeBytes));
          if (schemas.length === 1) {
            return schemas[0];
          }
          return z.union(schemas as unknown as [z.ZodTypeAny, z.ZodTypeAny]);
        }
      }
      return z.instanceof(File).refine((file) => file.size <= sizeBytes, {
        message: "File size is too large",
      });
    }
    case "option": {
      return z.string().min(1, "Please select an option");
    }
    default:
      return z.string().optional();
  }
};

const buildFormSchema = (form: FormBuild | null) => {
  if (!form) return z.object({ userEmail: emailSchema() });
  const elements = Object.values(form.builderData).flatMap((block) => block.formBlockElements);
  const shape: Record<string, z.ZodTypeAny> = {
    userEmail: emailSchema(),
  };
  elements.forEach((el) => {
    shape[el.id] = buildElementSchema(el);
  });
  return z.object(shape);
};

const toResolverErrors = (issues: z.ZodIssue[]): FieldErrors => {
  const fieldErrors: FieldErrors = {};
  issues.forEach((issue) => {
    const path = issue.path.join(".");
    if (!path) return;
    fieldErrors[path] = {
      type: issue.code,
      message: issue.message,
    } as any;
  });
  return fieldErrors;
};

const zodResolver = (schema: z.ZodSchema<any>): Resolver<SubmissionFormValues> => {
  return async (values) => {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      return { values: parsed.data, errors: {} };
    }
    return { values: {}, errors: toResolverErrors(parsed.error.issues) };
  };
};

const getFieldValue = (value: any) => {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (value instanceof File) {
    return {
      name: value.name,
      size: value.size,
      type: value.type,
    };
  }
  return value;
};

const isFilledValue = (value: any) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return !Number.isNaN(value);
  if (typeof value === "boolean") return true;
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (value instanceof File) return value.size > 0;
  if (value instanceof FileList) return value.length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return false;
};

function renderOptionInput(el: FormElement, register: UseFormRegister<SubmissionFormValues>, disabled: boolean) {
  return (
    <div className="flex flex-col gap-2">
      {el.options?.map((opt: FormOption) => {
        return (
          <label key={opt.id} className="flex items-center gap-2 text-[12px] text-gray-700">
            <input type="radio" value={opt.value} disabled={disabled} {...register(el.id)} />
            <span>{opt.value}</span>
          </label>
        );
      })}
    </div>
  );
}

function renderInputType(
  element: FormElement,
  register: UseFormRegister<SubmissionFormValues>,
  setValue: (name: any, value: any, options?: any) => void,
  watch: (name: any) => any,
  disabled: boolean,
) {
  switch (element.type) {
    case "short":
      return <DefaultInputComponent disabled={disabled} {...register(element.id)} />;
    case "long":
      return <LongInputComponent disabled={disabled} {...register(element.id)} />;
    case "date": {
      const value = watch(element.id) as Date | undefined;
      return (
        <DatePickerComponent
          disabled={disabled}
          value={value}
          onChange={(date) => setValue(element.id, date, { shouldValidate: true, shouldDirty: true })}
        />
      );
    }
    case "file":
      return (
        <FileInputComponent
          disabled={disabled}
          id={`file-${element.id}`}
          {...register(element.id, {
            setValueAs: (files: FileList | null) => (files ? files[0] : undefined),
          })}
        />
      );
    case "number":
      return <DefaultInputComponent disabled={disabled} type="number" {...register(element.id, { valueAsNumber: true })} />;
    case "url":
      return <DefaultInputComponent disabled={disabled} type="url" {...register(element.id)} />;
    case "phone":
      return <DefaultInputComponent disabled={disabled} type="tel" {...register(element.id)} />;
    default:
      return <DefaultInputComponent disabled={disabled} {...register(element.id)} />;
  }
}

function FormSubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [formData, setFormData] = useState<FormBuild | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    blocks,
    currentStep,
    setFormData: setLiveFormData,
    nextStep,
    prevStep,
    isSubmitting,
    setSubmitting,
    submitError,
    setSubmitError,
    submitSuccess,
    setSubmitSuccess,
    setValue: setLiveValue,
    setError,
    clearErrors,
  } = useFormLiveStore();

  useEffect(() => {
    try {
      fetchLiveFormData(id)
        .then((data) => {
          setFormData(data);
          setLiveFormData(data);
        })
        .catch((err) => {
          setLoadError(err instanceof Error ? err.message : String(err));
        });
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    }
  }, [id, setLiveFormData]);

  const schema = useMemo(() => buildFormSchema(formData), [formData]);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    clearErrors();
    Object.entries(errors).forEach(([fieldId, error]) => {
      const message = (error as any)?.message as string | undefined;
      if (message) {
        setError(fieldId, message);
      }
    });
  }, [errors, clearErrors, setError]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        setLiveValue(name, (value as any)[name]);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setLiveValue]);

  const stepCount = blocks.length;
  const activeBlock = blocks[currentStep];
  const watchedValues = watch();
  const allElementIds = useMemo(
    () => blocks.flatMap((block) => block.formBlockElements.map((el) => el.id)),
    [blocks],
  );
  const totalQuestions = allElementIds.length + 1;
  const filledQuestions = useMemo(() => {
    if (!totalQuestions) return 0;
    let count = 0;
    if (isFilledValue((watchedValues as any)?.userEmail)) {
      count += 1;
    }
    allElementIds.forEach((id) => {
      if (isFilledValue((watchedValues as any)?.[id])) {
        count += 1;
      }
    });
    return count;
  }, [allElementIds, totalQuestions, watchedValues]);
  const progressValue = totalQuestions > 0 ? (filledQuestions / totalQuestions) * 100 : 0;

  const handleNext = async () => {
    if (!activeBlock) return;
    const fieldIds = activeBlock.formBlockElements.map((el) => el.id);
    const isValid = await trigger(fieldIds);
    if (isValid) {
      nextStep();
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  const onSubmit = async (values: SubmissionFormValues) => {
    if (!formData) return;
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      const submissionData: Record<string, any> = {};
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "userEmail") {
          submissionData[key] = getFieldValue(value);
        }
      });
      await submitFormResponse(formData.id, values.userEmail, submissionData);
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit form");
    } finally {
      setSubmitting(false);
    }
  };

  const hasBlocks = blocks.length > 0;

  return formData ? (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="h-[70px] w-full md:w-[720px] flex flex-col justify-center bg-white border-[1px] border-gray-200 px-6 gap-2">
        <div className="flex justify-between items-center">
          <p className="text-[16px] font-[600] leading-[22px] text-gray-950">{formData.formName}</p>
          {hasBlocks && (
            <p className="text-[12px] text-gray-500">
              Step {currentStep + 1} of {stepCount}
            </p>
          )}
        </div>
        <div className="h-[6px] w-full rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full bg-gray-900 transition-all" style={{ width: `${progressValue}%` }} />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-[calc(100vh_-_70px)] w-full md:w-[720px] flex flex-col justify-start border-l-[1px] border-r-[1px] border-gray-200 bg-white p-6 gap-6 overflow-y-auto"
      >
        {loadError && <p className="text-[12px] text-red-600">{loadError}</p>}

        <div className="w-full flex flex-col gap-2">
          <label className="text-[14px] text-gray-950 font-[600] leading-5">Email</label>
          <DefaultInputComponent
            type="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            {...register("userEmail")}
          />
          {errors.userEmail && <span className="text-[12px] text-red-600">{errors.userEmail.message as string}</span>}
        </div>

        {activeBlock ? (
          <div className="w-full border-[1px] rounded-md p-5 flex flex-col gap-4">
            <p className="text-[20px] font-[600] text-gray-950">{activeBlock.formBlockTitle}</p>
            <div className="flex flex-col gap-6">
              {activeBlock.formBlockElements.map((element: FormElement) => (
                <div key={`form-element-${element.id}`} className="w-full flex flex-col gap-1">
                  <label className="text-[14px] text-gray-950 font-[600] leading-5">{element.main_title}</label>
                  {element.sub_title ? <p className="text-[12px] text-gray-600">{element.sub_title}</p> : null}
                  {element.type !== "option"
                    ? renderInputType(element, register, setValue, watch, isSubmitting)
                    : renderOptionInput(element, register, isSubmitting)}
                  {errors[element.id] && (
                    <span className="text-[12px] text-red-600">{errors[element.id]?.message as string}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full text-[14px] text-gray-500">No form steps available.</div>
        )}

        {submitError && <p className="text-[12px] text-red-600">{submitError}</p>}
        {submitSuccess && <p className="text-[12px] text-emerald-600">Form submitted successfully.</p>}

        <div className="w-full flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 py-2 border-[1px] border-gray-200 rounded-lg text-[12px] font-[600] text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          {currentStep < stepCount - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[12px] font-[600]"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-[12px] font-[600] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  ) : (
    <div className="h-screen w-screen flex flex-col justify-center items-center">Loading...</div>
  );
}

export default FormSubmitPage;
