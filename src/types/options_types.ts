import type { OmniSchema } from "./schema_types";
import type { OmniWriteToken } from "./privacy_types";

export type CloneMode = "none" | "shallow" | "deep";
export type SubscriberTiming = "PRE" | "POST";

export interface OmniSubscriber {
  id: string;
  fn: Function;
  type: 0 | 1;
  once?: boolean;
}

export interface SetOptions {
  immediate?: boolean;
  history?: boolean;
  historyLimit?: number;
  clone?: CloneMode;
  silent?: boolean;
  suppressTimeline?: boolean;
  asObject?: boolean;
  pushToArray?: boolean;

  schema?: OmniSchema;
  privateSet?: boolean;
  owner?: string;
  deletePolicy?: "anyone" | "owner" | "never";
  token?: OmniWriteToken;

  validate?: boolean;
  coerce?: boolean;
}

export interface InternalSetOptions extends SetOptions {
  suppressNotifications?: boolean;
  suppressAlerts?: boolean;
  suppressWaiters?: boolean;
  dryRun?: boolean;
  action?: "set" | "setObj" | "canSet";
}

export interface BatchOptions {
  notify?: boolean;
  alerts?: boolean;
  waiters?: boolean;
  validate?: boolean;
  coerce?: boolean;
  history?: boolean;
  suppressTimeline?: boolean;
}

export interface GetOptions {
  clone?: CloneMode;
  asObject?: boolean;
}
