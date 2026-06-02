import type { OmniCoercer, OmniDataTypeName, OmniValidator } from "./datatype_types";

export interface OmniSchema {
  type?: OmniDataTypeName;
  required?: boolean;
  nullable?: boolean;
  default?: unknown | (() => unknown);
  coerce?: boolean | OmniCoercer;
  validate?: OmniValidator | OmniValidator[];

  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  enum?: unknown[];
  pattern?: RegExp | string;

  children?: Record<string, OmniSchema>;
  items?: OmniSchema;
  strictObject?: boolean;
  atomic?: boolean;

  history?: boolean;
  historyLimit?: number;

  privateSet?: boolean;
  readonly?: boolean;
  writeOnce?: boolean;
  deletePolicy?: "anyone" | "owner" | "never";

  onInvalid?: "reject" | "keepOld" | "setDefault";
  description?: string;
  meta?: Record<string, unknown>;
}

export interface OmniResolvedSchema {
  path: string;
  pattern: string;
  schema: OmniSchema;
  score: number;
}
