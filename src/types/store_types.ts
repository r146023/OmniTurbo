import type { OmniSubscriber } from "./options_types";

export type OmniTimelineAction = "created" | "updated" | "deleted" | "undo" | "redo";

export interface ChangeLogEntry {
  timestamp: number;
  oldValue: unknown;
  newValue: unknown;
  action: OmniTimelineAction;
  index?: number;
}

export interface TimelineEntry {
  timestamp: number;
  path: string;
  oldValue: unknown;
  newValue: unknown;
  action: OmniTimelineAction;
  index: number;
}

export interface OmniValueObject {
  value: unknown;
  prev?: unknown;
  subs?: Map<string, OmniSubscriber>;
  history?: unknown[];
  historySize?: number;
  historyIndex?: number;
  created: number;
  updated?: number;
  isPrimitive: boolean;
  needsClone: boolean;
  frozen?: boolean;
  changeLog?: ChangeLogEntry[];
}

export interface BatchOperation {
  path: string;
  value: unknown;
  options?: Record<string, unknown>;
}
