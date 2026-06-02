import type { OmniDataTypeDefinition } from "../types/datatype_types";
import { OMNI_REJECT } from "../types/datatype_types";
import { isPlainObjectValue } from "../core/object";

const numberCoerce = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : OMNI_REJECT;
  }
  return OMNI_REJECT;
};

const booleanCoerce = (value: unknown) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off"].includes(normalized)) return false;
  }
  if (typeof value === "number") return value !== 0;
  return OMNI_REJECT;
};

export const builtInDataTypes: OmniDataTypeDefinition[] = [
  { name: "any", validate: () => true },
  { name: "unknown", validate: () => true },
  { name: "string", coerce: (value) => (value == null ? OMNI_REJECT : String(value)), validate: (value) => typeof value === "string" },
  { name: "number", coerce: numberCoerce, validate: (value) => typeof value === "number" && Number.isFinite(value) },
  { name: "integer", base: "number", coerce: (value) => {
    const n = numberCoerce(value);
    return typeof n === "number" && Number.isInteger(n) ? n : OMNI_REJECT;
  }, validate: (value) => typeof value === "number" && Number.isInteger(value) },
  { name: "boolean", coerce: booleanCoerce, validate: (value) => typeof value === "boolean" },
  { name: "object", validate: isPlainObjectValue },
  { name: "array", validate: Array.isArray },
  { name: "null", validate: (value) => value === null },
  { name: "undefined", validate: (value) => value === undefined },
];
