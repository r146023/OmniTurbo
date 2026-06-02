import { generateFastId } from "../core/ids";
import { getParentPaths, normalizePath } from "../core/path";
import type { OmniSubscriber, SubscriberTiming } from "../types/options_types";

export interface AlertConfig {
  id: string;
  path: string;
  fn: Function;
  condition?: Function;
  throttle: number;
  lastTrigger: number;
  once: boolean;
}

export interface CoerceConfig {
  id: string;
  path: string;
  fn: (path: string, value: unknown, oldValue?: unknown) => unknown;
  condition?: Function;
  throttle: number;
  lastTrigger: number;
  once: boolean;
}

export interface GlobalSubscriberConfig {
  id: string;
  fn: (path: string, newValue: unknown, oldValue: unknown) => void;
  throttle?: number;
  lastTrigger?: number;
  once?: boolean;
}

export class SubscriptionRegistry {
  private directSubs = new Map<string, Map<string, OmniSubscriber>>();
  private treeSubs = new Map<string, Map<string, OmniSubscriber>>();
  private globalSubscribers = new Map<string, GlobalSubscriberConfig>();
  private alerts = new Map<string, AlertConfig[]>();
  private coercers = new Map<string, CoerceConfig[]>();

  subscribe(path: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("sub");
    let bucket = this.directSubs.get(normalized);
    if (!bucket) this.directSubs.set(normalized, (bucket = new Map()));
    bucket.set(id, { id, fn: callback, type: type === "PRE" ? 0 : 1 });
    return () => bucket?.delete(id);
  }

  getDirectBucket(path: string): Map<string, OmniSubscriber> | undefined {
    return this.directSubs.get(normalizePath(path));
  }

  subscribeTree(prefix: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    const normalized = normalizePath(prefix);
    const id = generateFastId("treesub");
    let bucket = this.treeSubs.get(normalized);
    if (!bucket) this.treeSubs.set(normalized, (bucket = new Map()));
    bucket.set(id, { id, fn: callback, type: type === "PRE" ? 0 : 1 });
    return () => bucket?.delete(id);
  }

  subscribeGlobal(fn: GlobalSubscriberConfig["fn"], options: { throttle?: number; once?: boolean } = {}): () => void {
    const id = generateFastId("globalsub");
    this.globalSubscribers.set(id, { id, fn, throttle: options.throttle, once: options.once, lastTrigger: 0 });
    return () => this.globalSubscribers.delete(id);
  }

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

  alert(path: string, callback: Function, options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("alert");
    const alert: AlertConfig = { id, path: normalized, fn: callback, condition: options.condition, throttle: options.throttle ?? 0, lastTrigger: 0, once: options.once ?? false };
    const bucket = this.alerts.get(normalized) ?? [];
    bucket.push(alert);
    this.alerts.set(normalized, bucket);
    return () => this.removeAlert(id);
  }

  triggerAlerts(path: string, value: unknown, oldValue: unknown): void {
    const bucket = this.alerts.get(normalizePath(path));
    if (!bucket?.length) return;
    const now = Date.now();
    for (let i = bucket.length - 1; i >= 0; i--) {
      const alert = bucket[i];
      if (alert.throttle && now - alert.lastTrigger < alert.throttle) continue;
      if (alert.condition && !alert.condition(value, oldValue)) continue;
      alert.fn(value, oldValue, path);
      alert.lastTrigger = now;
      if (alert.once) bucket.splice(i, 1);
    }
  }

  coercer(path: string, callback: CoerceConfig["fn"], options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    const normalized = normalizePath(path);
    const id = generateFastId("coercer");
    const coerce: CoerceConfig = { id, path: normalized, fn: callback, condition: options.condition, throttle: options.throttle ?? 0, lastTrigger: 0, once: options.once ?? false };
    const bucket = this.coercers.get(normalized) ?? [];
    bucket.push(coerce);
    this.coercers.set(normalized, bucket);
    return () => this.removeCoercer(id);
  }

  triggerCoercers(path: string, value: unknown, oldValue: unknown): unknown {
    const bucket = this.coercers.get(normalizePath(path));
    if (!bucket?.length) return value;
    const now = Date.now();
    let output = value;
    for (let i = bucket.length - 1; i >= 0; i--) {
      const coerce = bucket[i];
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
