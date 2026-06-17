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

/**
 * ## SetOptions
 *
 * The `SetOptions` interface defines the structure of the options that can be passed to a set
 * operation in the Omni system. It includes the following properties:
 *
 * - `immediate`: A boolean indicating whether the set operation should be performed immediately,
 *   bypassing any batching or queuing mechanisms.
 * - `history`: A boolean indicating whether the set operation should be recorded in the history
 *   log.
 * - `historyLimit`: A number specifying the maximum number of history entries to keep for this set
 *   operation.
 * - `clone`: A string that specifies the cloning mode to use for the value being set, which can be
 *   "none", "shallow", or "deep".
 * - `silent`: A boolean indicating whether the set operation should be performed silently, without
 *   triggering any notifications or alerts.
 * - `suppressTimeline`: A boolean indicating whether the set operation should be suppressed from
 *   the timeline view.
 * - `asObject`: A boolean indicating whether the value being set should be treated as an object,
 *   even if it's a primitive type.
 * - `pushToArray`: A boolean indicating whether the value being set should be pushed to an array if
 *   the target path is an array.
 * - `schema`: An optional `OmniSchema` that should be applied during the set operation for
 *   validation and coercion.
 * - `privateSet`: A boolean indicating whether the set operation is being performed through a
 *   private setter, which may have different privacy rules applied.
 * - `owner`: An optional string representing the owner of the set operation, which may be used for
 *   permission checks and history logging.
 * - `deletePolicy`: A string that specifies the delete policy for the set operation, which can be
 *   "anyone", "owner", or "never". This policy determines who is allowed to delete the data being
 *   set.
 * - `token`: An optional `OmniWriteToken` that may be used for authentication and permission checks
 *   during the set operation.
 * - `validate`: A boolean indicating whether the value being set should be validated against the
 *   schema or data type rules.
 * - `coerce`: A boolean indicating whether the value being set should be coerced to match the
 *   schema or data type rules, if applicable.
 *
 * This interface is designed to provide a comprehensive set of options that can be used to control
 * the behavior of set operations in the Omni system, allowing for greater flexibility and
 * customization based on the specific requirements of each operation.
 *
 */
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
