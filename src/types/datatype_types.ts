import type { OmniIssue } from "./issue_types";

export const NO_COERCE = "__NO_COERCE__" as const;
export const OMNI_REJECT = Symbol("OMNI_REJECT");

export type OmniDataTypeName =
  | "any"
  | "unknown"
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null"
  | "undefined"
  | "integer"
  | (string & {});

export interface OmniCoerceContext {
  path: string;
  oldValue?: unknown;
}

/**
 * ## OmniValidateContext
 *
 * The `OmniValidateContext` interface defines the structure of the context object that is passed to
 * validator functions in the Omni system. It includes the following properties:
 * - `path`: A string representing the location in the data structure where the validation is
 *   occurring (e.g., "user.name").
 * - `originalValue` (optional): The original value before any coercion or validation is applied.
 *   This can be useful for validators that need to compare the current value against the original
 *   value.
 * - `oldValue` (optional): An alias for `originalValue`, included for backward compatibility. It
 *   serves the same purpose as `originalValue` and can be used interchangeably in validator
 *   functions.
 *
 * This interface is designed to provide a standardized way to represent the context in which
 * validation is taking place, allowing validator functions to access relevant information about the
 * data being validated and its location within the overall data structure.
 */
export interface OmniValidateContext {
  path: string;
  originalValue?: unknown;
  oldValue?: unknown;
}

export type OmniCoerceResult = unknown | typeof NO_COERCE | typeof OMNI_REJECT;

export type OmniCoercer = (value: unknown, context: OmniCoerceContext) => OmniCoerceResult;

export type OmniValidator = (value: unknown, context: OmniValidateContext) => boolean | string | OmniIssue | OmniIssue[];

export interface OmniDataTypeDefinition<T = unknown> {
  name: OmniDataTypeName;
  title?: string;
  base?: OmniDataTypeName;
  coerce?: OmniCoercer;
  validate?: OmniValidator;
  is?: (value: unknown) => value is T;
}
