export type OmniIssueSeverity = "debug" | "info" | "warning" | "error";

export type OmniIssueSource =
  | "schema"
  | "datatype"
  | "privacy"
  | "coercion"
  | "subscription"
  | "history"
  | "batch"
  | "alias"
  | "internal";


/**
 * ## OmniIssue
 *
 * - `code`: A string identifier for the type of issue (e.g., "type_mismatch", "missing_field").
 * - `severity`: The severity level of the issue, which can be "debug", "info", "warning", or
 *   "error".
 * - `path`: A string representing the location in the data structure where the issue occurred
 *   (e.g., "user.name").
 * - `message`: A human-readable message describing the issue.
 * - `source`: The origin of the issue, which can be:
 *  - "schema"
 *  - "datatype"
 *  - "privacy",
 *  - "coercion"
 *  - "subscription"
 *  - "history"
 *  - "batch"
 *  - "alias"
 *  - "internal".
 * - `expected` (optional): The expected value or type that was not met.
 * - `received` (optional): The actual value or type that was received, which caused the issue.
 * - `details` (optional): An object containing any additional information relevant to the issue.
 *
 * This interface is designed to provide a standardized way to represent and handle issues that
 * arise during data processing, validation, coercion, or any other operations within the Omni
 * system. By including detailed information about the issue, it allows for better debugging,
 * logging, and user feedback.
 *
 */
export interface OmniIssue {
  code: string;
  severity: OmniIssueSeverity;
  path: string;
  message: string;
  source: OmniIssueSource;
  expected?: unknown;
  received?: unknown;
  details?: Record<string, unknown>;
}

export const createIssue = (issue: OmniIssue): OmniIssue => issue;
