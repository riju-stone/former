import { FormElement } from "./formState";

export type FormBuild = {
  id: string;
  formName: string;
  builderData: Array<FormElement>;
  createdAt: Date;
  updatedAt: Date;
};

export const FormTypes = [
  {
    name: "Short answer",
    tag: "short",
    validations: [
      {
        name: "Maximum Allowed Characters",
        tag: "max_characters",
        type: "number",
        defaultValue: 120,
        placeholder: "Maximum Characters",
        isRequired: true,
      },
      {
        name: "Minimum Allowed Characters",
        tag: "min_characters",
        type: "number",
        defaultValue: 0,
        placeholder: "Minimum Characters",
      },
    ],
  },
  {
    name: "Long Answer",
    tag: "long",
    validations: [
      {
        name: "Maximum Allowed Characters",
        tag: "max_characters",
        type: "number",
        defaultValue: 300,
        placeholder: "Maximum Characters",
        isRequired: true,
      },
      {
        name: "Minimum Allowed Characters",
        tag: "min_characters",
        type: "number",
        defaultValue: 0,
        placeholder: "Minimum Characters",
      },
    ],
  },
  {
    name: "Single select",
    tag: "option",
    validations: [],
  },
  {
    name: "Number",
    tag: "number",
    validations: [
      {
        name: "Allowed Range",
        tag: "min_value",
        type: "range",
        defaultValue: [0, 1000000],
        placeholder: "Allowed Range",
      },
    ],
  },
  {
    name: "URL",
    tag: "url",
    validations: [],
  },
  {
    name: "Date",
    tag: "date",
    validations: [
      {
        name: "Minimum Date",
        tag: "min_date",
        type: "date",
        defaultValue: new Date(),
        placeholder: "Minimum Date",
      },
      {
        name: "Maximum Date",
        tag: "max_date",
        type: "date",
        defaultValue: new Date(
          new Date().setFullYear(new Date().getFullYear() + 10)
        ),
        placeholder: "Maximum Date",
      },
    ],
  },
  {
    name: "File upload",
    tag: "file",
    validations: [
      {
        name: "Maximum File Size (in MB)",
        tag: "max_file_size",
        type: "number",
        defaultValue: 10,
        placeholder: "Maximum File Size",
      },
      {
        name: "Allowed File Types",
        tag: "allowed_file_types",
        type: "array",
        defaultValue: ["jpg", "jpeg", "png", "pdf"],
        placeholder: "Allowed File Types",
        isRequired: true,
      },
    ],
  },
];
