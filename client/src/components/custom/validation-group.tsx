import React, { useState, useEffect, useMemo } from "react";
import { DatePickerComponent } from "@/components/custom/date-picker";
import { useFormStore } from "@/store/formBuilderStore";
import { debounce } from "lodash";

function ValidationInput({
  validation,
  elementId,
  formBlockId,
}: {
  validation: any;
  elementId: string;
  formBlockId: string;
}) {
  const validationType = validation.type;
  const { updateElementConstraint } = useFormStore((state) => state);

  // Local state for debounced inputs
  const [localValue, setLocalValue] = useState(validation.customValue || validation.defaultValue);

  // Sync local state when validation changes
  useEffect(() => {
    setLocalValue(validation.customValue || validation.defaultValue);
  }, [validation.customValue, validation.defaultValue]);

  // Debounced update function
  const debouncedUpdate = useMemo(
    () => debounce((value: any) => updateElementConstraint(elementId, validation.id, value, formBlockId), 300),
    [elementId, validation.id, formBlockId, updateElementConstraint],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  switch (validationType) {
    case "number":
      return (
        <input
          className="h-[32px] w-[150px] bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg"
          type={validation.type}
          value={localValue}
          disabled={false}
          onChange={(e) => {
            const numValue = Number(e.target.value);
            setLocalValue(numValue);
            debouncedUpdate(numValue);
          }}
        />
      );
    case "array":
      return (
        <select
          className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg cursor-pointer"
          value={localValue}
          onChange={(e) => {
            const value = e.target.value;
            setLocalValue(value);
            updateElementConstraint(elementId, validation.id, value, formBlockId);
          }}
        >
          {validation.defaultValue.split(",").map((item: any) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      );
    case "date":
      return <DatePickerComponent disabled={false} />;
    case "boolean":
      return (
        <div className="h-[32px] w-[150px] flex items-center gap-2">
          <div
            key="true"
            className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg cursor-pointer text-center"
          >
            Yes
          </div>
          <div
            key="false"
            className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg cursor-pointer text-center"
          >
            No
          </div>
        </div>
      );
    default:
      return (
        <input
          className="h-[32px] w-[250px] bg-transparent px-2 py-[6px] text-[12px] text-gray-950 outline-none border-[1px] border-gray-200 rounded-lg"
          type={validation.type}
          value={localValue}
          disabled={false}
          onChange={(e) => {
            const numValue = Number(e.target.value);
            setLocalValue(numValue);
            debouncedUpdate(numValue);
          }}
        />
      );
  }
}

function ValidationGroupComponent({
  validationGroup,
  elementId,
  formBlockId,
}: {
  validationGroup: any;
  elementId: string;
  formBlockId: string;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex-col items-center gap-2">
        {validationGroup.map((validation: any) => (
          <div key={validation.id} className="w-full flex items-center gap-2 my-2">
            <label className="text-[12px] text-gray-500 font-[500] text-nowrap">{validation.name}</label>
            <ValidationInput validation={validation} elementId={elementId} formBlockId={formBlockId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidationGroupComponent;
