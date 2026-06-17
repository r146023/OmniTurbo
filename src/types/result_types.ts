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


/**
 * ## OmniResult
 *
 * - `success`: A boolean indicating whether the operation was successful.
 * - `action`: A string representing the type of action performed (e.g., "set", "delete", "schema").
 * - `path`: A string indicating the location in the data structure where the operation occurred
 *   (e.g., "user.name").
 * - `originalValue` (optional): The original value before the operation was performed.
 * - `value` (optional): The new value after the operation was performed.
 * - `oldValue` (optional): An alias for `originalValue`, included for backward compatibility.
 * - `changed` (optional): A boolean indicating whether the value was changed as a result of the
 *   operation.
 * - `rejected` (optional): A boolean indicating whether the operation was rejected (e.g., due to
 *   validation failure).
 * - `issues`: An array of `OmniIssue` objects representing any issues that were encountered during
 *   the operation.
 * - `options` (optional): An object containing any additional options or metadata relevant to the
 *   operation.
 * - `schema` (optional): The `OmniSchema` that was applied during the operation, if applicable.
 * - `setter` (optional): The `OmniPrivateSetter` that was used during the operation, if applicable.
 * - `children` (optional): An array of `OmniResult` objects representing the results of any child
 *   operations that were performed as part of a batch or nested operation.
 *
 * This interface is designed to provide a comprehensive and standardized way to represent the
 * outcome of operations performed within the Omni system. By including detailed information about
 * the operation, any issues encountered, and the context in which it occurred, it allows for better
 * debugging, logging, and user feedback.
 *
 */
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
