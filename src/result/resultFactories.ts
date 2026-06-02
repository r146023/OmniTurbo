import type { OmniIssue } from "../types/issue_types";
import type { OmniAction, OmniResult } from "../types/result_types";

export function okResult<T = unknown>(params: {
  action: OmniAction;
  path: string;
  originalValue?: unknown;
  value?: T;
  oldValue?: unknown;
  changed?: boolean;
  issues?: OmniIssue[];
  options?: Record<string, unknown>;
  setter?: OmniResult["setter"];
  schema?: OmniResult["schema"];
  children?: OmniResult[];
}): OmniResult<T> {
  return {
    success: true,
    rejected: false,
    issues: params.issues ?? [],
    changed: params.changed ?? false,
    ...params,
  };
}

export function failResult<T = unknown>(params: {
  action: OmniAction;
  path: string;
  originalValue?: unknown;
  value?: T;
  oldValue?: unknown;
  issues: OmniIssue[];
  options?: Record<string, unknown>;
  schema?: OmniResult["schema"];
  children?: OmniResult[];
}): OmniResult<T> {
  return {
    success: false,
    rejected: true,
    changed: false,
    ...params,
  };
}

export function mergeResults(action: OmniAction, path: string, children: OmniResult[]): OmniResult {
  const failed = children.filter((child) => !child.success);
  return {
    success: failed.length === 0,
    rejected: failed.length > 0,
    action,
    path,
    changed: children.some((child) => child.changed),
    issues: children.flatMap((child) => child.issues),
    children,
  };
}
