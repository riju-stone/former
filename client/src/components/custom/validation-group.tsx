import React from "react";
import { DatePickerComponent } from "@/components/custom/date-picker";
import { useFormStore } from "@/store/formBuilderStore";

function ValidationInput({
  validation,
  elementId,
}: {
  validation: any;
  elementId: string;
}) {
  const validationType = validation.type;
  const { updateElementConstraint } = useFormStore((state) => state);

  switch (validationType) {
    case "number":
      return (
        <input
          className="h-[32px] w-[150px] bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg"
          type={validation.type}
          value={validation.customValue || validation.defaultValue}
          disabled={false}
          onChange={(e) =>
            updateElementConstraint(
              elementId,
              validation.id,
              Number(e.target.value)
            )
          }
        />
      );
    case "array":
      return (
        <select
          className="h-[32px] w-full bg-transparent px-2 py-[6px] text-[12px] text-gray-600 outline-none border-[1px] border-gray-200 rounded-lg cursor-pointer"
          onChange={(e) =>
            updateElementConstraint(elementId, validation.id, e.target.value)
          }
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
          value={validation.customValue || validation.defaultValue}
          disabled={false}
          onChange={(e) =>
            updateElementConstraint(
              elementId,
              validation.id,
              Number(e.target.value)
            )
          }
        />
      );
  }
}

function ValidationGroupComponent({
  validationGroup,
  elementId,
}: {
  validationGroup: any;
  elementId: string;
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex-col items-center gap-2">
        {validationGroup.map((validation: any) => (
          <div
            key={validation.id}
            className="w-full flex items-center gap-2 my-2"
          >
            <label className="text-[12px] text-gray-500 font-[500] text-nowrap">
              {validation.name}
            </label>
            <ValidationInput validation={validation} elementId={elementId} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidationGroupComponent;
