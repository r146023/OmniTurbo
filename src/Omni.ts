import { AliasRegistry } from "./aliases/AliasRegistry";
import { batchObject } from "./batch/batch";
import { buildObjectFromEntries, fastClone, flattenObjectSimple, isPlainObjectValue, isPrimitive } from "./core/object";
import { normalizePath } from "./core/path";
import { fastEquals } from "./core/equality";
import { builtInDataTypes } from "./datatypes/builtins";
import { DataTypeRegistry } from "./datatypes/DataTypeRegistry";
import { PrivacyRegistry } from "./privacy/PrivacyRegistry";
import { createPrivateSetter } from "./privacy/writeTokens";
import { failResult, mergeResults, okResult } from "./result/resultFactories";
import { SchemaRegistry } from "./schema/SchemaRegistry";
import { resolveDefault } from "./schema/schemaDefaults";
import { runSchemaValidation } from "./schema/schemaValidation";
import { ensureHistory } from "./history/history";
import { Timeline } from "./history/timeline";
import { SubscriptionRegistry } from "./subscriptions/subscriptions";
import type { OmniIssue } from "./types/issue_types";
import type { BatchOptions, GetOptions, InternalSetOptions, SetOptions, SubscriberTiming } from "./types/options_types";
import type { OmniResult } from "./types/result_types";
import type { OmniSchema } from "./types/schema_types";
import type { OmniValueObject } from "./types/store_types";

/**
 * Omni is a path-first state store that can act as either:
 * - a loose value bag, or
 * - a governed in-memory path database with schemas, datatypes, privacy, history, and subscriptions.
 *
 * Freedom remains the default. Enforcement only exists when a schema/privacy rule is provided.
 */
export class Omni {
  private store = new Map<string, OmniValueObject>();
  private batchMode = false;
  private batchQueue: Array<{ path: string; value: unknown; options?: InternalSetOptions }> = [];
  private parentNotifications = true;
  private getObjCache = new Map<string, { data: unknown; ref: unknown }>();
  private waiters: Array<{ keys: string[]; exclude: unknown[]; resolve: Function }> = [];

  public readonly dataTypes = new DataTypeRegistry();
  public readonly schemas = new SchemaRegistry();
  public readonly privacy = new PrivacyRegistry();
  public readonly aliases = new AliasRegistry();
  public readonly subscriptions = new SubscriptionRegistry();
  public readonly timeline = new Timeline();

  public verbose = false;

  constructor() {
    this.dataTypes.registerMany(builtInDataTypes);
  }

  /**
   * Enables or disables notifying parent paths when a child path changes.
   * This is not an efficiency mode; it is a semantic choice for tree subscriptions.
   */
  setParentNotifications(enabled: boolean): void {
    this.parentNotifications = enabled;
  }

  define(pathPattern: string, schema: OmniSchema): OmniResult {
    return this.schema(pathPattern, schema);
  }

  schema(pathPattern: string, schema: OmniSchema): OmniResult {
    const path = normalizePath(pathPattern);
    this.schemas.define(path, schema);
    return okResult({ action: "schema", path, value: schema, changed: true });
  }

  getSchema(path: string): OmniSchema | undefined {
    return this.schemas.resolve(this.aliases.resolve(path))?.schema;
  }

  explain(path: string): Record<string, unknown> {
    const resolved = this.aliases.resolve(path);
    return {
      path: resolved,
      value: this.get(resolved, { asObject: true }),
      exactValue: this.get(resolved),
      schema: this.schemas.resolve(resolved),
      privacy: this.privacy.getRuleForPath(resolved),
      has: this.has(resolved),
      timeline: this.timeline.list().filter((entry) => entry.path === resolved),
    };
  }

  set(path: string, value: unknown, options: SetOptions = {}): OmniResult {
    const resolved = this.aliases.resolve(path);

    if (options.asObject) {
      if (!isPlainObjectValue(value)) {
        return failResult({
          action: "setObj",
          path: resolved,
          originalValue: value,
          value,
          issues: [{
            code: "OMNI_AS_OBJECT_EXPECTS_OBJECT",
            severity: "error",
            path: resolved,
            message: "set with asObject:true expects a plain object.",
            source: "internal",
            expected: "plain object",
            received: value,
          }],
        });
      }
      return this.setObj(value, resolved, options);
    }

    if (this.batchMode && !options.immediate) {
      this.batchQueue.push({ path: resolved, value, options });
      return okResult({ action: "set", path: resolved, originalValue: value, value, changed: true });
    }

    return this._setInternal(resolved, value, { ...options, action: "set" });
  }

  setObj(obj: Record<string, unknown>, pathPrefix?: string, options: SetOptions = {}): OmniResult {
    const rootPath = pathPrefix ? this.aliases.resolve(pathPrefix) : "";
    if (!isPlainObjectValue(obj)) {
      return failResult({
        action: "setObj",
        path: rootPath || "<root>",
        originalValue: obj,
        value: obj,
        issues: [{
          code: "OMNI_SET_OBJ_EXPECTS_OBJECT",
          severity: "error",
          path: rootPath || "<root>",
          message: "setObj expects a plain object.",
          source: "internal",
          expected: "plain object",
          received: obj,
        }],
      });
    }

    let rootToken = options.token;
    let setter: OmniResult["setter"] | undefined;
    const rootSchema = rootPath ? this.schemas.resolve(rootPath)?.schema : undefined;
    if ((options.privateSet || rootSchema?.privateSet) && rootPath) {
      rootToken = this.privacy.createRule(rootPath, {
        owner: options.owner,
        canWriteChildren: true,
        deletePolicy: options.deletePolicy ?? rootSchema?.deletePolicy ?? "owner",
      });
      setter = createPrivateSetter(rootToken, (p, v, o) => this.set(p, v, o));
    }

    const flattened = flattenObjectSimple(obj);
    const children: OmniResult[] = [];
    for (const [relative, value] of Object.entries(flattened)) {
      const path = rootPath ? `${rootPath}.${relative}` : relative;
      children.push(this._setInternal(path, value, { ...options, token: rootToken, privateSet: false, action: "setObj" }));
    }

    if (Object.keys(flattened).length === 0 && rootPath) {
      children.push(this._setInternal(rootPath, {}, { ...options, token: rootToken, privateSet: false, action: "setObj" }));
    }

    const result = mergeResults("setObj", rootPath || "<root>", children);
    result.setter = setter;
    return result;
  }

  canSet(path: string, value: unknown, options: SetOptions = {}): OmniResult {
    return this._setInternal(this.aliases.resolve(path), value, { ...options, dryRun: true, action: "canSet" });
  }

  private _setInternal(path: string, rawValue: unknown, options: InternalSetOptions = {}): OmniResult {
    const normalized = normalizePath(path);
    const action = options.action ?? "set";
    const oldEntry = this.store.get(normalized);
    const oldValue = oldEntry?.value;
    const originalValue = rawValue;
    const issues: OmniIssue[] = [];

    const privacyCheck = this.privacy.canWrite(normalized, options.token);
    if (!privacyCheck.allowed && privacyCheck.issue) {
      return failResult({ action, path: normalized, originalValue, value: rawValue, oldValue, issues: [privacyCheck.issue] });
    }

    if (options.schema) this.schemas.define(normalized, options.schema);
    const resolvedSchema = this.schemas.resolve(normalized);
    const schema = resolvedSchema?.schema;

    if (schema?.readonly && oldEntry) {
      return failResult({
        action,
        path: normalized,
        originalValue,
        value: rawValue,
        oldValue,
        schema,
        issues: [{ code: "OMNI_READONLY", severity: "error", path: normalized, message: "Path is readonly.", source: "privacy" }],
      });
    }

    if (schema?.writeOnce && oldEntry) {
      return failResult({
        action,
        path: normalized,
        originalValue,
        value: rawValue,
        oldValue,
        schema,
        issues: [{ code: "OMNI_WRITE_ONCE", severity: "error", path: normalized, message: "Path can only be written once.", source: "privacy" }],
      });
    }

    if (!options.silent) {
      rawValue = this.subscriptions.triggerCoercers(normalized, rawValue, oldValue);
    }

    const pipeline = runSchemaValidation({
      path: normalized,
      value: rawValue,
      oldValue,
      schema,
      dataTypes: this.dataTypes,
      coerce: options.coerce,
      validate: options.validate,
    });
    issues.push(...pipeline.issues);
    let value = pipeline.value;

    if (!pipeline.success) {
      if (schema?.onInvalid === "keepOld") value = oldValue;
      else if (schema?.onInvalid === "setDefault") value = resolveDefault(schema);
      else return failResult({ action, path: normalized, originalValue, value, oldValue, schema, issues });
    }

    if (oldEntry && fastEquals(value, oldValue)) {
      return okResult({ action, path: normalized, originalValue, value, oldValue, changed: false, issues, schema });
    }

    let setter: OmniResult["setter"] | undefined;
    let token = options.token;
    if ((options.privateSet || schema?.privateSet) && !options.dryRun) {
      token = this.privacy.createRule(normalized, {
        owner: options.owner,
        canWriteChildren: true,
        deletePolicy: options.deletePolicy ?? schema?.deletePolicy ?? "owner",
      });
      setter = createPrivateSetter(token, (p, v, o) => this.set(p, v, o));
    }

    if (options.dryRun) {
      return okResult({ action, path: normalized, originalValue, value, oldValue, changed: !fastEquals(value, oldValue), issues, schema, setter });
    }

    if (isPrimitive(value) || Array.isArray(value)) {
      this.deleteChildren(normalized, options);
    }

    if (Array.isArray(value) && options.pushToArray) {
      const current = this.get(normalized);
      if (current === undefined) value = [...value];
      else if (!Array.isArray(current)) {
        return failResult({
          action,
          path: normalized,
          originalValue,
          value,
          oldValue,
          issues: [{ code: "OMNI_PUSH_NON_ARRAY", severity: "error", path: normalized, message: "Cannot push to non-array path.", source: "internal", expected: "array", received: current }],
        });
      } else value = [...current, ...value];
    }

    const now = Date.now();
    const isPrim = isPrimitive(value);
    let entry = oldEntry;
    if (!entry) {
      entry = { value, prev: undefined, created: now, isPrimitive: isPrim, needsClone: !isPrim };
      if (options.history !== false && schema?.history !== false) {
        entry.history = [];
        entry.historySize = options.historyLimit ?? schema?.historyLimit ?? 10;
        entry.historyIndex = -1;
      }
      this.store.set(normalized, entry);
      if (!options.suppressTimeline) this.timeline.add(normalized, undefined, value, "created");
    } else {
      if (options.history !== false && schema?.history !== false) ensureHistory(entry, oldValue, options.historyLimit ?? schema?.historyLimit ?? entry.historySize ?? 10);
      entry.prev = oldValue;
      entry.value = value;
      entry.updated = now;
      entry.isPrimitive = isPrim;
      entry.needsClone = !isPrim;
      if (!options.suppressTimeline) this.timeline.add(normalized, oldValue, value, "updated");
    }

    this.invalidateObjCache(normalized);

    if (!options.silent) {
      if (!options.suppressNotifications) {
        this.subscriptions.notify(normalized, value, oldValue, (parent) => this.getObj(parent) ?? this.get(parent), this.parentNotifications);
      }
      if (!options.suppressWaiters) this.checkWaiters();
      if (!options.suppressAlerts) this.subscriptions.triggerAlerts(normalized, value, oldValue);
    }

    return okResult({ action, path: normalized, originalValue, value, oldValue, changed: true, issues, schema, setter });
  }

  get(path: string, options: GetOptions = {}): unknown {
    const normalized = this.aliases.resolve(path);
    const entry = this.store.get(normalized);
    if (entry && entry.value !== undefined) return fastClone(entry.value, options.clone ?? "none");
    if (options.asObject) return this.getObj(normalized, options);
    return undefined;
  }

  getObj(path: string, options: GetOptions = {}): Record<string, unknown> | undefined {
    const normalized = this.aliases.resolve(path);
    const cached = this.getObjCache.get(normalized);
    if (cached) return fastClone(cached.data, options.clone ?? "none") as Record<string, unknown>;

    const data = buildObjectFromEntries(Array.from(this.store.entries()).map(([p, v]) => [p, v.value]), normalized);
    if (data) this.getObjCache.set(normalized, { data, ref: data });
    return data ? (fastClone(data, options.clone ?? "none") as Record<string, unknown>) : undefined;
  }

  getMany(paths: string[]): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const path of paths) result[path] = this.get(path);
    return result;
  }

  has(path: string, types?: string[] | string): boolean {
    const normalized = this.aliases.resolve(path);
    if (!this.store.has(normalized)) return false;
    if (!types) return true;
    return this.isType(normalized, types);
  }

  exists(path: string): boolean {
    return this.has(path);
  }

  isType(path: string, types: string[] | string): boolean {
    const value = this.get(path);
    if (value === undefined) return false;
    const typeList = Array.isArray(types) ? types : [types];
    return typeList.includes(Array.isArray(value) ? "array" : value === null ? "null" : typeof value);
  }

  isPlainObject(path: string): boolean {
    return isPlainObjectValue(this.get(path));
  }

  delete(path: string, options: SetOptions = {}): OmniResult {
    const normalized = this.aliases.resolve(path);
    const privacyCheck = this.privacy.canDelete(normalized, options.token);
    if (!privacyCheck.allowed && privacyCheck.issue) return failResult({ action: "delete", path: normalized, issues: [privacyCheck.issue] });

    const oldValue = this.get(normalized);
    const existed = this.store.delete(normalized);
    this.deleteChildren(normalized, options);
    this.privacy.removeRule(normalized);
    this.invalidateObjCache(normalized);
    if (existed && !options.suppressTimeline) this.timeline.add(normalized, oldValue, undefined, "deleted");
    return okResult({ action: "delete", path: normalized, oldValue, changed: existed });
  }

  private deleteChildren(path: string, options: SetOptions = {}): void {
    const prefix = path + ".";
    let removed = 0;
    for (const key of Array.from(this.store.keys())) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
        removed++;
      }
    }
    if (removed > 0 && !options.suppressTimeline) this.timeline.add(path, undefined, undefined, "deleted");
  }

  batch(operationsOrObject: (() => void) | Record<string, unknown>, pathPrefix?: string, options: BatchOptions = { notify: false, alerts: false, waiters: false }): OmniResult {
    if (typeof operationsOrObject === "function") {
      const wasBatchMode = this.batchMode;
      this.batchMode = true;
      this.batchQueue = [];
      operationsOrObject();
      const queued = [...this.batchQueue];
      this.batchMode = wasBatchMode;
      this.batchQueue = [];

      const children = queued.map(({ path, value, options: setOptions }) => this._setInternal(path, value, {
        ...(setOptions ?? {}),
        suppressNotifications: options.notify === false,
        suppressAlerts: options.alerts === false,
        suppressWaiters: options.waiters === false,
        validate: options.validate,
        coerce: options.coerce,
        history: options.history,
        suppressTimeline: options.suppressTimeline,
      }));
      if (options.waiters !== false) this.checkWaiters();
      return mergeResults("batch", "<function>", children);
    }

    const childrenBefore = this.timeline.list().length;
    batchObject(operationsOrObject, (p, v, o) => this._setInternal(p, v, o as InternalSetOptions), pathPrefix, options);
    const changed = this.timeline.list().length !== childrenBefore;
    return okResult({ action: "batch", path: pathPrefix ?? "<root>", changed });
  }

  subscribe(path: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    return this.subscriptions.subscribe(this.aliases.resolve(path), callback, type);
  }

  subscribeTree(prefix: string, callback: Function, type: SubscriberTiming = "POST"): () => void {
    return this.subscriptions.subscribeTree(this.aliases.resolve(prefix), callback, type);
  }

  subscribeGlobal(callback: (path: string, newValue: unknown, oldValue: unknown) => void, options: { throttle?: number; once?: boolean } = {}): () => void {
    return this.subscriptions.subscribeGlobal(callback, options);
  }

  alert(path: string, callback: Function, options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    return this.subscriptions.alert(this.aliases.resolve(path), callback, options);
  }

  coercer(path: string, callback: (path: string, value: unknown, oldValue?: unknown) => unknown, options: { condition?: Function; throttle?: number; once?: boolean } = {}): () => void {
    return this.subscriptions.coercer(this.aliases.resolve(path), callback, options);
  }

  waitFor(keys: string | string[], exclude: unknown[] = [undefined, null]): Promise<Record<string, unknown>> {
    const keyList = Array.isArray(keys) ? keys.map((k) => this.aliases.resolve(k)) : [this.aliases.resolve(keys)];
    return new Promise((resolve) => {
      this.waiters.push({ keys: keyList, exclude, resolve });
      this.checkWaiters();
    });
  }

  private checkWaiters(): void {
    if (!this.waiters.length) return;
    this.waiters = this.waiters.filter((waiter) => {
      const results: Record<string, unknown> = {};
      for (const key of waiter.keys) {
        const value = this.get(key);
        if (waiter.exclude.includes(value)) return true;
        results[key] = value;
      }
      waiter.resolve(results);
      return false;
    });
  }

  toggle(path: string): boolean {
    const current = this.get(path);
    if (current !== undefined && typeof current !== "boolean" && typeof current !== "number" && typeof current !== "string") {
      throw new Error(`Cannot toggle non-primitive value at path: ${path}`);
    }
    const next = !current;
    this.set(path, next);
    return next;
  }

  increment(path: string, amount = 1): number {
    const current = this.get(path);
    if (current === undefined) {
      this.set(path, amount);
      return amount;
    }
    if (typeof current !== "number") throw new Error(`Cannot increment non-number at path: ${path}`);
    const next = current + amount;
    this.set(path, next);
    return next;
  }

  decrement(path: string, amount = 1): number {
    return this.increment(path, -amount);
  }

  undo(path: string): OmniResult {
    const normalized = this.aliases.resolve(path);
    const entry = this.store.get(normalized);
    if (!entry?.history?.length) {
      return failResult({ action: "set", path: normalized, issues: [{ code: "OMNI_NO_HISTORY", severity: "warning", path: normalized, message: "No history available for undo.", source: "history" }] });
    }
    const previous = entry.history.pop();
    const oldValue = entry.value;
    entry.prev = oldValue;
    entry.value = previous;
    this.timeline.add(normalized, oldValue, previous, "undo");
    this.invalidateObjCache(normalized);
    this.subscriptions.notify(normalized, previous, oldValue, (parent) => this.getObj(parent) ?? this.get(parent), this.parentNotifications);
    return okResult({ action: "set", path: normalized, value: previous, oldValue, changed: true });
  }

  clear(): void {
    this.store.clear();
    this.getObjCache.clear();
    this.timeline.clear();
  }

  export(): Record<string, unknown> {
    return {
      store: Array.from(this.store.entries()).map(([path, entry]) => [path, { ...entry, subs: undefined }]),
      schemas: this.schemas.list(),
      privacy: this.privacy.list(),
      aliases: this.aliases.list(),
      timeline: this.timeline.list(),
    };
  }

  private invalidateObjCache(path: string): void {
    this.getObjCache.delete(path);
    const parts = path.split(".");
    while (parts.length > 1) {
      parts.pop();
      this.getObjCache.delete(parts.join("."));
    }
  }
}

export default Omni;
