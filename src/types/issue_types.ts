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
