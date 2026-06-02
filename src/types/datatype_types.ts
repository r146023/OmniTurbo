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
