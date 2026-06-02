import { flattenObjectSimple } from "../core/object";
import type { BatchOptions } from "../types/options_types";

export type BatchSetFunction = (path: string, value: unknown, options?: Record<string, unknown>) => unknown;

export function batchObject(obj: Record<string, unknown>, set: BatchSetFunction, pathPrefix?: string, options: BatchOptions = {}): void {
  const flattened = flattenObjectSimple(obj);
  for (const [key, value] of Object.entries(flattened)) {
    const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;
    set(fullPath, value, {
      suppressNotifications: options.notify === false,
      suppressAlerts: options.alerts === false,
      suppressWaiters: options.waiters === false,
      validate: options.validate,
      coerce: options.coerce,
      history: options.history,
      suppressTimeline: options.suppressTimeline,
    });
  }
}
