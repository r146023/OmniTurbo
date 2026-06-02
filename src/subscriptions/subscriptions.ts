import { generateFastId } from "../core/ids";
import { getParentPaths, normalizePath } from "../core/path";
import type { OmniSubscriber, SubscriberTiming } from "../types/options_types";


/**
 * ### Alert Config
 *
 * - `id`: A unique identifier for the alert, generated when the alert is registered.
 * - `path`: The normalized path for which the alert is registered. Alerts will be triggered when a
 *   value is set at this path.
 * - `fn`: The alert function that will be called when the alert is triggered. It should have the
 *   signature `(newValue: unknown, oldValue: unknown, path: string) => void`, where `newValue` is
 *   the new value being set, `oldValue` is the previous value at that path (if any), and `path` is
 *   the normalized path being set.
 * - `condition`: An optional function that determines whether the alert should be triggered based
 *   on the new and old values. It should have the signature `(newValue: unknown, oldValue: unknown)
 *   => boolean`, where it returns true if the alert should be triggered, or false to skip
 *   triggering.
 * - `throttle`: An optional number representing the minimum time in milliseconds between alert
 *   triggers. If specified, the alert will only be triggered if at least this amount of time has
 *   passed since the last trigger.
 * - `lastTrigger`: A timestamp of the last time the alert was triggered, used in conjunction with
 *   throttling to determine if the alert can be triggered again.
 * - `once`: A boolean flag indicating whether the alert should only be triggered once. If true, the
 *   alert will be automatically unregistered after being triggered for the first time.
 *
 */
export interface AlertConfig {
  id: string;
  path: string;
  fn: Function;
  condition?: Function;
  throttle: number;
  lastTrigger: number;
  once: boolean;
}

/**
 * ### Coerce Config
 *
 * - `id`: A unique identifier for the coercer, generated when the coercer is registered.
 * - `path`: The normalized path for which the coercer is registered. Coercers will be triggered
 *   when a value is set at this path, allowing for transformation of the value before it is set.
 * - `fn`: The coercer function that will be called when the coercer is triggered. It should have
 *   the signature `(path: string, value: unknown, oldValue?: unknown) => unknown`, where `path` is
 *   the normalized path being set, `value` is the new value being set, and `oldValue` is the
 *   previous value at that path (if any). The function should return the coerced value that will
 *   actually be set at that path.
 * - `condition`: An optional function that determines whether the coercer should be triggered based
 *   on the new and old values. It should have the signature `(value: unknown, oldValue: unknown) =>
 *   boolean`, where it returns true if the coercer should be triggered, or false to skip
 *   triggering.
 * - `throttle`: An optional number representing the minimum time in milliseconds between coercer
 *   triggers. If specified, the coercer will only be triggered if at least this amount of time has
 *   passed since the last trigger.
 * - `lastTrigger`: A timestamp of the last time the coercer was triggered, used in conjunction with
 *   throttling to determine if the coercer can be triggered again.
 * - `once`: A boolean flag indicating whether the coercer should only be triggered once. If true,
 *   the coercer will be automatically unregistered after being triggered for the first time.
 */
export interface CoerceConfig {
  id: string;
  path: string;
  fn: (path: string, value: unknown, oldValue?: unknown) => unknown;
  condition?: Function;
  throttle: number;
  lastTrigger: number;
  once: boolean;
}

/**
 * ### Global Subscriber Config
 * - `id`: A unique identifier for the global subscriber, generated when the subscriber is
 *   registered.
 * - `fn`: The subscriber function that will be called for every change at any path. It should have
 *   the signature `(path: string, newValue: unknown, oldValue: unknown) => void`, where `path` is
 *   the normalized path where the change occurred, `newValue` is the new value at that path, and
 *   `oldValue` is the previous value at that path (if any).
 * - `throttle`: An optional number representing the minimum time in milliseconds between subscriber
 *   triggers. If specified, the subscriber will only be triggered if at least this amount of time
 *   has passed since the last trigger.
 * - `lastTrigger`: A timestamp of the last time the subscriber was triggered, used in conjunction
 *   with throttling to determine if the subscriber can be triggered again.
 * - `once`: A boolean flag indicating whether the subscriber should only be triggered once. If
 *   true, the subscriber will be automatically unregistered after being triggered for the first
 *   time.
 *
 * #### Be Cautious
 * Global subscribers can have a significant performance impact if they perform heavy computations
 * or Listening to every path in the store will trigger damn near constant calls to the subscriber,
 * so it's important to use them judiciously and ensure that the subscriber function is optimized
 * for performance. Consider using throttling or the `once` option to mitigate potential performance
 * issues when using global subscribers.
 *
 */
export interface GlobalSubscriberConfig {
  id: string;
  fn: (path: string, newValue: unknown, oldValue: unknown) => void;
  throttle?: number;
  lastTrigger?: number;
  once?: boolean;
}

/**
 * ## Subscription Registry
 *
 * The SubscriptionRegistry class manages all subscribers, alerts, and coercers for the Omni data
 * store. It allows for registering direct subscribers for specific paths, tree subscribers for path
 * prefixes, and global subscribers that listen to all changes. It also handles alerts that can be
 * triggered during set operations and coercers that can transform values before they are set. The
 * registry provides methods to subscribe, notify changes, trigger alerts, and manage coercers,
 * ensuring that all relevant functions are called appropriately based on the paths and options
 * specified.
 *
 */
export class SubscriptionRegistry {
  private directSubs = new Map<string, Map<string, OmniSubscriber>>();
  private treeSubs = new Map<string, Map<string, OmniSubscriber>>();
  private globalSubscribers = new Map<string, GlobalSubscriberConfig>();
  private alerts = new Map<string, AlertConfig[]>();
  private coercers = new Map<string, CoerceConfig[]>();

  /**
   * Registers a direct subscriber function for a specific path. Direct subscribers are functions
   * that will be called only when a change occurs at the exact specified path. The subscriber
   * function will receive the normalized path, new value, and old value as arguments whenever a
   * change occurs at that path. Direct subscribers are useful for reacting to changes at specific
   * paths without being triggered by changes at parent or child paths. The path will be normalized
   * before storing, so it will match the normalized paths used when notifying changes. This method
   * returns a function that can be called to remove the registered subscriber when it is no longer
   * needed.
   *
   * @param path The path for which to register the direct subscriber. This will be normalized
   * before storing, so it should be in a format that can be normalized (e.g., using dot notation).
   * The subscriber will only be triggered for changes at this exact path, and not for changes at
   * parent or child paths. This allows for precise reactions to changes at specific locations in
   * the data store.
   * @param callback The subscriber function that will be called when a change occurs at the
   * specified path. It should have the signature `(path: string, newValue: unknown, oldValue:
   * unknown) => void`, where `path` is the normalized path where the change occurred, `newValue` is
   * the new value at that path, and `oldValue` is the previous value at that path (if any). The
   * subscriber can use these arguments to react to changes at this specific path.
   * @param type Optional timing for the subscriber, either "PRE" or "POST". This determines whether
   * the subscriber is called before or after tree subscribers for parent paths are called. The
   * default is "POST", meaning the direct subscriber will be called after tree subscribers. If set
   * to "PRE", the direct subscriber will be called before tree subscribers. This can be useful for
   * certain use cases where you want to react to changes at this path before other subscribers are
   * notified.
   * @returns A function that can be called to remove the registered direct subscriber. When called,
   * it will unregister the subscriber so it will no longer be triggered for future changes at the
   * specified path.
   *
   */
  subscribe(path: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("sub");
    let bucket = this.directSubs.get(normalized);
    if (!bucket) this.directSubs.set(normalized, (bucket = new Map()));
    bucket.set(id, { id, fn: callback, type: type === "PRE" ? 0 : 1 });
    return () => bucket?.delete(id);
  }

  /**
   * Retrieves the direct subscriber bucket for a specific path. This method returns the map of
   * direct subscribers that are registered for the exact given path. The path will be normalized
   * before looking up, so it will match the normalized paths used when subscribers are registered.
   * The returned bucket contains subscribers that will be triggered only for changes at this exact
   * path, and it does not include subscribers that are registered for parent paths (tree
   * subscribers) or global subscribers. This method can be used internally when notifying changes
   * at a specific path to access the direct subscribers that need to be triggered. If there are no
   * direct subscribers for the given path, this method will return undefined.
   *
   * @param path The path for which to retrieve the direct subscriber bucket. This will be
   * normalized before looking up. The returned bucket contains subscribers that are registered for
   * this exact path, and it does not include tree subscribers or global subscribers. This can be
   * used internally to access the direct subscribers when notifying changes at a specific path. If
   * there are no direct subscribers for the given path, this method will return undefined.
   * @returns A Map of direct subscribers for the specified path, or undefined if there are no
   * direct subscribers registered for that path. The keys of the Map are subscriber IDs, and the
   * values are OmniSubscriber objects containing the subscriber function and metadata. This bucket
   * will only include subscribers that are registered for this exact path, and it does not include
   * tree subscribers or global subscribers.
   */
  getDirectBucket(path: string): Map<string, OmniSubscriber> | undefined {
    return this.directSubs.get(normalizePath(path));
  }

  /**
   * Registers a tree subscriber function for a specific path prefix. Tree subscribers are functions
   * that will be called for changes at any path that starts with the specified prefix. This allows for
   * reacting to changes in an entire subtree of the data store without needing to register individual
   * subscribers for each path. The subscriber function will receive the parent path (the prefix), the
   * full path where the change occurred, the new value, and the old value as arguments whenever a change
   * occurs at any path that matches the prefix. Tree subscribers can be useful for monitoring changes in a
   *
   * @param prefix The path prefix for which to register the tree subscriber. This will be normalized before storing.
   * @param callback The tree subscriber function that will be called when a change occurs at any path that starts with the specified prefix. It should have the signature `(parentPath: string, fullPath: string, newValue: unknown, oldValue: unknown) => void`, where `parentPath` is the normalized prefix path, `fullPath` is the normalized path where the change occurred, `newValue` is the new value at that path, and `oldValue` is the previous value at that path (if any). The subscriber can use these arguments to react to changes in the subtree of paths that match the prefix.
   * @param type Optional timing for the subscriber, either "PRE" or "POST". This determines whether the subscriber is called before or after direct subscribers for the exact path are called. The default is "POST", meaning the tree subscriber will be called after direct subscribers. If set to "PRE", the tree subscriber will be called before direct subscribers. This can be useful for certain use cases where you want to react to changes before other subscribers are notified.
   * @returns A function that can be called to remove the registered tree subscriber. When called, it will unregister the subscriber so it will no longer be triggered for future changes at paths that match the specified prefix.
   */
  subscribeTree(prefix: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    const normalized = normalizePath(prefix);
    const id = generateFastId("treesub");
    let bucket = this.treeSubs.get(normalized);
    if (!bucket) this.treeSubs.set(normalized, (bucket = new Map()));
    bucket.set(id, { id, fn: callback, type: type === "PRE" ? 0 : 1 });
    return () => bucket?.delete(id);
  }

  /**
   * Registers a global subscriber function that will be called for every change at any path. Global
   * subscribers are useful for logging, debugging, or any functionality that needs to react to all
   * changes in the data store. They can have optional throttling to limit how often they are
   * triggered, and they can also be set to trigger only once. The subscriber function will receive
   * the path, new value, and old value as arguments whenever a change occurs.
   *
   * ## Be Cautious
   * Global subscribers can have a significant performance impact if they perform heavy computations
   * or Listening to every path in the store will trigger damn near constant calls to the
   * subscriber, so it's important to use them judiciously and ensure that the subscriber function
   * is optimized for performance. Consider using throttling or the `once` option to mitigate
   * potential performance issues when using global subscribers.
   *
   *
   * @param fn The subscriber function to register as a global subscriber. It should have the
   * signature
   * @param options Optional settings for the global subscriber:
   * @returns A function that can be called to remove the registered global subscriber. When called,
   * it will
   */
  subscribeGlobal(fn: GlobalSubscriberConfig["fn"], options: { throttle?: number; once?: boolean } = {}): () => void {
    const id = generateFastId("globalsub");
    this.globalSubscribers.set(id, { id, fn, throttle: options.throttle, once: options.once, lastTrigger: 0 });
    return () => this.globalSubscribers.delete(id);
  }

  /**
   * Notifies subscribers of a change at a specific path. This method is responsible for triggering
   * all relevant subscribers when a value changes at a given path. It will notify direct
   * subscribers for the exact path, tree subscribers for any parent paths, and global subscribers
   * for all changes. The notification includes the new value, old value, and the normalized path.
   * Subscribers with the `once` option will be automatically unregistered after being triggered.
   * Global subscribers can also have throttling to limit how often they are triggered.
   * @param path The path where the change occurred. This will be normalized before looking up
   * subscribers. Subscribers
   * @param value The new value that has been set at the specified path. This is passed to
   * subscriber functions as an argument, along with the old value and path. Subscribers can use
   * this value in their logic to respond to the change.
   * @param oldValue The previous value at the specified path before the change. This is passed to
   * subscriber functions as an argument, along with the new value and path. Subscribers can use
   * this value in their logic to compare against the new value or perform actions based on what
   * changed. It can be undefined if there was no previous value.
   * @param getParentValue A function that can be called to retrieve the current value of a parent
   * path. This is used when notifying tree subscribers and when the `parentNotifications` option is
   * enabled, allowing subscribers to get the current value of parent paths without needing to
   * access the main data store directly. The function takes a parent path as an argument and
   * returns the current value at that path.
   * @param parentNotifications A boolean flag that indicates whether to notify direct subscribers
   * of parent paths about changes to their child paths. If true, then when a change occurs at a
   * path, direct subscribers for all parent paths will also be notified with the current value of
   * the parent path. This allows for more comprehensive notifications but can result in more
   * subscriber calls, so it should be used based on the needs of the application.
   * @returns void
   * @remarks This method is typically called internally by the set operation after a value has been
   * changed, to ensure that all relevant subscribers are notified of the change. It handles the
   * logic for determining which subscribers to notify based on the path and options provided.
   */
  notify(path: string, value: unknown, oldValue: unknown, getParentValue: (parent: string) => unknown, parentNotifications: boolean): void {
    const normalized = normalizePath(path);
    const direct = this.directSubs.get(normalized);
    if (direct?.size) {
      for (const sub of Array.from(direct.values())) {
        sub.fn(normalized, value, oldValue);
        if (sub.once) direct.delete(sub.id);
      }
    }

    const now = Date.now();
    for (const sub of Array.from(this.globalSubscribers.values())) {
      if (sub.throttle && sub.lastTrigger && now - sub.lastTrigger < sub.throttle) continue;
      sub.fn(normalized, value, oldValue);
      sub.lastTrigger = now;
      if (sub.once) this.globalSubscribers.delete(sub.id);
    }

    for (const parent of getParentPaths(normalized)) {
      const bucket = this.treeSubs.get(parent);
      if (bucket?.size) {
        for (const sub of Array.from(bucket.values())) {
          sub.fn(parent, normalized, value, oldValue);
          if (sub.once) bucket.delete(sub.id);
        }
      }
    }

    if (parentNotifications) {
      for (const parent of getParentPaths(normalized)) {
        const bucket = this.directSubs.get(parent);
        if (!bucket?.size) continue;
        const parentValue = getParentValue(parent);
        for (const sub of Array.from(bucket.values())) {
          sub.fn(parent, parentValue, undefined);
          if (sub.once) bucket.delete(sub.id);
        }
      }
    }
  }

  /**
   * Registers an alert function for a specific path. Alerts are functions that can be triggered
   * when a specific path is set to a new value, allowing for critical checks, transformations, or
   * side effects that must happen before subscribers are notified. The alert will be triggered
   * synchronously during the set operation, and it can have optional conditions and throttling to
   * control when it runs.
   * @param path The path for which to register the alert. This will be normalized before storing.
   * Alerts registered
   * @param callback The alert function that will be called when a value is set at the specified
   * path. It should have the signature `(newValue: unknown, oldValue: unknown, path: string) =>
   * void`, where `newValue` is the new value being set, `oldValue` is the previous value at that
   * path (if any), and `path` is the normalized path being set. The alert can perform critical
   * checks or transformations based on these values, and it can throw an error to prevent the set
   * operation from completing if necessary.
   * @param options Optional settings for the alert:
   * @returns A function that can be called to remove the registered alert. When called, it will
   * unregister the alert so it will no longer be triggered for future set operations at the
   * specified path.
   */
  alert(path: string, callback: Function, options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("alert");
    const alert: AlertConfig = { id, path: normalized, fn: callback, condition: options.condition, throttle: options.throttle ?? 0, lastTrigger: 0, once: options.once ?? false };
    const bucket = this.alerts.get(normalized) ?? [];
    bucket.push(alert);
    this.alerts.set(normalized, bucket);
    return () => this.removeAlert(id);
  }

  /**
   * Triggers alerts for a given path and value. Alerts are functions that can be registered to run
   * when a specific path is set to a new value. They can have optional conditions that determine
   * whether they should run based on the new and old values, as well as throttling to limit how
   * often they can be triggered. When an alert is triggered, it will be called with the new value,
   * old value, and path as arguments. If an alert has the `once` option set to true, it will be
   * automatically unregistered after being triggered once.
   * @param path The path for which to trigger alerts. This will be normalized before looking up
   * alerts. Alerts registered
   * @param value The new value that is being set at the specified path. This is passed to alert
   * functions as an argument, along with the old value and path. Alerts can use this value in their
   * logic, and conditions can compare it to the old value to decide whether to run the alert or
   * not.
   * @param oldValue The previous value at the specified path before the change. This is passed to
   * alert functions as an argument, along with the new value and path. Alerts can use this value in
   * their logic, and conditions can compare it to the new value to decide whether to run the alert
   * or not. It can be undefined if there was no previous value.
   * @returns void
   * @remarks Alerts are triggered synchronously during the set operation, before any subscribers
   * are notified. This means that if an alert modifies the value or throws an error, it can affect
   * the outcome of the set operation and whether subscribers are notified. Use alerts for critical
   * checks or transformations that must happen before subscribers are involved.
   */
  triggerAlerts(path: string, value: unknown, oldValue: unknown): void {
    const bucket = this.alerts.get(normalizePath(path));
    if (!bucket?.length) return;
    const now = Date.now();
    for (let i = bucket.length - 1; i >= 0; i--) {
      const alert = bucket[i];
      if (!alert) continue;
      if (alert.throttle && now - alert.lastTrigger < alert.throttle) continue;
      if (alert.condition && !alert.condition(value, oldValue)) continue;
      alert.fn(value, oldValue, path);
      alert.lastTrigger = now;
      if (alert.once) bucket.splice(i, 1);
    }
  }

  /**
   * Registers a coercer function for a specific path. Coercers are functions that can transform a
   * value before it is set, allowing for validation, normalization, or other transformations. The
   * coercer will be triggered whenever a value is set at the specified path, and it can return a
   * new value to replace the original one. Coercers can also have optional conditions and
   * throttling to control when they are applied.
   *
   * @param path The path for which to register the coercer. This will be normalized before storing.
   * Coercers registered for this exact path will be triggered, but not coercers for parent or child
   * paths. Coercers will receive the normalized path as an argument, so they can perform their own
   * checks if needed.
   * @param callback The coercer function that will be called when a value is set at the specified
   * path. It should have the signature `(path: string, value: unknown, oldValue?: unknown) =>
   * unknown`, where `path` is the normalized path being set, `value` is the new value being set,
   * and `oldValue` is the previous value at that path (if any). The coercer should return the new
   * value to use for the set operation, or it can return `"__NO_COERCE__"` to indicate that no
   * coercion should be applied and the original value should be used.
   * @param options Optional settings for the coercer:
   * @returns A function that can be called to remove the registered coercer. When called, it will
   * unregister the coercer so it will no longer be triggered for future set operations at the
   * specified path.
   */
  coercer(path: string, callback: CoerceConfig["fn"], options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("coercer");
    const coerce: CoerceConfig = { id, path: normalized, fn: callback, condition: options.condition, throttle: options.throttle ?? 0, lastTrigger: 0, once: options.once ?? false };
    const bucket = this.coercers.get(normalized) ?? [];
    bucket.push(coerce);
    this.coercers.set(normalized, bucket);
    return () => this.removeCoercer(id);
  }

  /**
   * Triggers coercers for a given path and value, returning the final coerced value. Coercers are
   * applied
   * @param path The path for which to trigger coercers. This will be normalized before looking up
   * coercers. Coercers registered for this exact path will be triggered, but not coercers for
   * parent or child paths. Coercers will receive the normalized path as an argument, so they can
   * perform their own checks if needed. Coercers should return the new value or "__NO_COERCE__" to
   * skip coercion.
   * @param value The value to coerce. This is the value that will be passed to coercers and
   * potentially transformed by them. Coercers will receive the current value as an argument and can
   * return a new value to replace it. The final result after all coercers have been applied will be
   * returned by this function.
   * @param oldValue The previous value before the change. This is provided for coercers that need
   * to compare the new value with the old value to decide whether to coerce or not. Coercers will
   * receive this as an argument and can use it in their logic. It can be undefined if there was no
   * previous value.
   * @returns The final coerced value after all applicable coercers have been triggered. If no
   * coercers were triggered or if all coercers returned "__NO_COERCE__", this will be the original
   * value passed in. Otherwise, it will be the result of applying the coercion functions in
   * sequence, with each coercer potentially transforming the value further.
   */
  triggerCoercers(path: string, value: unknown, oldValue: unknown): unknown {
    const bucket = this.coercers.get(normalizePath(path));
    if (!bucket?.length) return value;
    const now = Date.now();
    let output = value;
    for (let i = bucket.length - 1; i >= 0; i--) {
      const coerce = bucket[i];
      if (!coerce) continue;
      if (coerce.throttle && now - coerce.lastTrigger < coerce.throttle) continue;
      if (coerce.condition && !coerce.condition(output, oldValue)) continue;
      const next = coerce.fn(path, output, oldValue);
      if (next !== "__NO_COERCE__") output = next;
      coerce.lastTrigger = now;
      if (coerce.once) bucket.splice(i, 1);
    }
    return output;
  }

  private removeAlert(id: string): void {
    for (const [path, bucket] of this.alerts.entries()) {
      const next = bucket.filter((item) => item.id !== id);
      if (next.length) this.alerts.set(path, next);
      else this.alerts.delete(path);
    }
  }

  private removeCoercer(id: string): void {
    for (const [path, bucket] of this.coercers.entries()) {
      const next = bucket.filter((item) => item.id !== id);
      if (next.length) this.coercers.set(path, next);
      else this.coercers.delete(path);
    }
  }
}
