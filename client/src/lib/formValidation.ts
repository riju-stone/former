import * as z from "zod";

export const emailSchema = () =>
  z.email({
    message: "Invalid email address",
  });

export const fileSchema = (fineType: string, fileSize: number) =>
  z
    .instanceof(File)
    .refine((file) => file.type === fineType, {
      message: "File type is not supported",
    })
    .refine((file) => file.size <= fileSize, {
      message: "File size is too large",
    });

export const urlSchema = () =>
  z.url({
    message: "Invalid URL",
  });

// Validate phone numbers
export const phoneSchema = () =>
  z.string().regex(/^\+?[1-9]\d{1,14}$/, {
    message: "Invalid phone number",
  });

// Validate a date object and also ensure it's a valid date
export const dateSchema = () =>
  z.date({
    message: "Invalid date",
  });

// Validate a number within a specific range
export const numberSchema = (minNumber: number, maxNumber: number) => z.number().min(minNumber).max(maxNumber);

// Make sure text does not contain any SQL injection patterns
export const textSchema = (minLength: number, maxLength: number) =>
  z
    .string()
    .min(minLength)
    .max(maxLength)
    .refine(
      (text) => {
        const sqlInjectionPattern =
          /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|UNION|OR|AND)\b)|(--|;|\/\*|\*\/|@@|@)/i;
        return !sqlInjectionPattern.test(text);
      },
      {
        message: "Text contains invalid characters",
      }
    );
