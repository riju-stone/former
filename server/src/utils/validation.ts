import type { FormBuilderBlockType } from "../types/form.types.js";
import customLogger from "./logger";
import { VALID_ELEMENT_TYPES } from "../types/form.types.js";

export function isValidBuilderData(data: unknown): data is Record<string, FormBuilderBlockType> {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return false;
  }

  for (const [key, block] of Object.entries(data as Record<string, unknown>)) {
    if (typeof block !== "object" || block === null || Array.isArray(block)) {
      customLogger.warn(`Invalid block at key "${key}": not an object`);
      return false;
    }

    const b = block as Record<string, unknown>;

    if (typeof b.blockId !== "string" || b.blockId.trim() === "") {
      customLogger.warn(`Invalid block at key "${key}": missing or empty blockId`);
      return false;
    }

    if (b.blockId !== key) {
      customLogger.warn(`Block key mismatch at key "${key}": blockId is "${b.blockId}"`);
      return false;
    }

    if (typeof b.formBlockTitle !== "string") {
      customLogger.warn(`Invalid block at key "${key}": formBlockTitle must be a string`);
      return false;
    }

    if (!Array.isArray(b.formBlockElements)) {
      customLogger.warn(`Invalid block at key "${key}": formBlockElements must be an array`);
      return false;
    }

    for (const el of b.formBlockElements as unknown[]) {
      if (!isValidFormElement(el, key)) return false;
    }
  }

  return true;
}

export function isValidFormElement(el: unknown, blockKey: string): boolean {
  if (typeof el !== "object" || el === null || Array.isArray(el)) {
    customLogger.warn(`Invalid element in block "${blockKey}": not an object`);
    return false;
  }

  const e = el as Record<string, unknown>;

  if (typeof e.id !== "string" || e.id.trim() === "") {
    customLogger.warn(`Invalid element in block "${blockKey}": missing or empty id`);
    return false;
  }

  if (typeof e.main_title !== "string") {
    customLogger.warn(`Invalid element in block "${blockKey}" (id: ${e.id}): main_title must be a string`);
    return false;
  }

  if (e.sub_title !== undefined && typeof e.sub_title !== "string") {
    customLogger.warn(`Invalid element in block "${blockKey}" (id: ${e.id}): sub_title must be a string when provided`);
    return false;
  }

  if (typeof e.type !== "string" || !(VALID_ELEMENT_TYPES as readonly string[]).includes(e.type)) {
    customLogger.warn(
      `Invalid element in block "${blockKey}" (id: ${e.id}): type "${e.type}" is not one of [${VALID_ELEMENT_TYPES.join(", ")}]`,
    );
    return false;
  }

  if (!Array.isArray(e.constraints)) {
    customLogger.warn(`Invalid element in block "${blockKey}" (id: ${e.id}): constraints must be an array`);
    return false;
  }

  for (const c of e.constraints as unknown[]) {
    if (!isValidConstraint(c, blockKey, String(e.id))) return false;
  }

  if (e.options !== undefined) {
    if (!Array.isArray(e.options)) {
      customLogger.warn(`Invalid element in block "${blockKey}" (id: ${e.id}): options must be an array when provided`);
      return false;
    }
    for (const opt of e.options as unknown[]) {
      if (!isValidOption(opt, blockKey, String(e.id))) return false;
    }
  }

  return true;
}

export function isValidConstraint(c: unknown, blockKey: string, elementId: string): boolean {
  if (typeof c !== "object" || c === null || Array.isArray(c)) {
    customLogger.warn(`Invalid constraint in block "${blockKey}" element "${elementId}": not an object`);
    return false;
  }

  const constraint = c as Record<string, unknown>;

  if (typeof constraint.id !== "string" || constraint.id.trim() === "") {
    customLogger.warn(`Invalid constraint in block "${blockKey}" element "${elementId}": missing or empty id`);
    return false;
  }

  if (typeof constraint.type !== "string") {
    customLogger.warn(`Invalid constraint in block "${blockKey}" element "${elementId}": type must be a string`);
    return false;
  }

  if (typeof constraint.name !== "string") {
    customLogger.warn(`Invalid constraint in block "${blockKey}" element "${elementId}": name must be a string`);
    return false;
  }

  if (typeof constraint.defaultValue !== "string") {
    customLogger.warn(
      `Invalid constraint in block "${blockKey}" element "${elementId}": defaultValue must be a string`,
    );
    return false;
  }

  if (constraint.customValue !== null && typeof constraint.customValue !== "string") {
    customLogger.warn(
      `Invalid constraint in block "${blockKey}" element "${elementId}": customValue must be a string or null`,
    );
    return false;
  }

  return true;
}

export function isValidOption(opt: unknown, blockKey: string, elementId: string): boolean {
  if (typeof opt !== "object" || opt === null || Array.isArray(opt)) {
    customLogger.warn(`Invalid option in block "${blockKey}" element "${elementId}": not an object`);
    return false;
  }

  const o = opt as Record<string, unknown>;

  if (typeof o.id !== "string" || o.id.trim() === "") {
    customLogger.warn(`Invalid option in block "${blockKey}" element "${elementId}": missing or empty id`);
    return false;
  }

  if (typeof o.value !== "string") {
    customLogger.warn(`Invalid option in block "${blockKey}" element "${elementId}": value must be a string`);
    return false;
  }

  return true;
}
