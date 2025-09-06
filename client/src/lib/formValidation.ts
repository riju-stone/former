import * as z from "zod";

export const emailSchema = () => z.email({
  message: "Invalid email address",
});

export const fileSchema = (fineType: string, fileSize: number) => z.instanceof(File).refine((file) => file.type === fineType, {
  message: "File type is not supported",
}).refine((file) => file.size <= fileSize, {
  message: "File size is too large",
});

export const urlSchema = () => z.url({
  message: "Invalid URL",
});

export const phoneSchema = () => z.string().min(10).max(15);

export const dateSchema = () => z.date({
  message: "Invalid date",
});

export const numberSchema = (minDate: number, maxDate: number) => z.number().min(minDate).max(maxDate);

export const textSchema = (minLength: number, maxLength: number) => z.string().min(minLength).max(maxLength);