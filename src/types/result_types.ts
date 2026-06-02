import type { OmniIssue } from "./issue_types";
import type { OmniSchema } from "./schema_types";
import type { OmniPrivateSetter } from "./privacy_types";

export type OmniAction =
  | "set"
  | "setObj"
  | "delete"
  | "batch"
  | "schema"
  | "datatype"
  | "privacy"
  | "canSet"
  | "noop";

export interface OmniResult<T = unknown> {
  success: boolean;
  action: OmniAction;
  path: string;
  originalValue?: unknown;
  value?: T;
  oldValue?: unknown;
  changed?: boolean;
  rejected?: boolean;
  issues: OmniIssue[];
  options?: Record<string, unknown>;
  schema?: OmniSchema;
  setter?: OmniPrivateSetter;
  children?: OmniResult[];
}
