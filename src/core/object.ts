/**
 * Checks if a value is a primitive (string, number, boolean, null, undefined) or an object. This is
 * used to determine if we can return the value directly without cloning, as primitives are
 * immutable and safe to return as-is.
 * @param val The value to check.
 * @returns True if the value is a primitive, false if it's an object or function.
 */
export const isPrimitive = (val: unknown): boolean => {
  const type = typeof val;
  return val === null || type !== "object";
};

/**
 * Checks if a value is a plain object (not null, not an array). This is used to determine if we can
 * @param value The value to check.
 * @returns True if the value is a plain object, false otherwise.
 */
export const isPlainObjectValue = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Optimized shallow clone (no deep clone by default)
/**
 * Fast cloning function that can perform shallow or deep cloning based on the specified mode. It
 * handles
 * @param obj The object to clone.
 * @param mode The cloning mode: 
 * - `none` (returns the original object)
 * - `shallow` (creates a shallow copy)
 * - `deep` (creates a deep copy).
 *
 * Defaults to "none".
 * @returns The cloned object based on the specified mode.
 */
export const fastClone = <T>(obj: T, mode: "none" | "shallow" | "deep" = "none"): T => {
  if (mode === "none" || isPrimitive(obj)) return obj;

  if (mode === "shallow") {
    if (Array.isArray(obj)) return [...obj] as T;
    if (obj instanceof Date) return new Date(obj) as T;
    return { ...(obj as Record<string, unknown>) } as T;
  }

  if (mode === "deep") {
    if (Array.isArray(obj)) return obj.map((item) => fastClone(item, "deep")) as T;
    if (obj instanceof Date) return new Date(obj) as T;

    const copy: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = fastClone((obj as Record<string, unknown>)[key], "deep");
      }
    }
    return copy as T;
  }

  return obj;
};

/**
 * Simple object flattener that excludes arrays (treats them as single values). This is faster than
 * a full deep flatten and is suitable for typical Omni use cases where arrays are not meant to be
 * flattened into individual entries. It also handles circular references by keeping track of seen
 * objects and skipping them to avoid infinite recursion.
 * @param obj The object to flatten.
 * @param prefix The prefix to prepend to keys (used for recursion).
 * @param seen A WeakSet to track seen objects and avoid circular references.
 * @returns A new object with flattened keys and values.
 */
export function flattenObjectSimple(obj: unknown, prefix = "", seen = new WeakSet<object>()): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!isPlainObjectValue(obj)) return result;

  if (seen.has(obj)) return result;
  seen.add(obj);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (isPlainObjectValue(value)) {
        Object.assign(result, flattenObjectSimple(value, newKey, seen));
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

/**
 * Builds a nested object from flattened entries, using dot notation for nesting. Only includes
 * entries that match the specified root path.
 * @param entries An iterable of [path, value] pairs, where paths are dot-separated strings.
 * @param rootPath An optional root path to filter entries. Only entries that are exactly this path
 * or start with this path followed by a dot will be included. If empty, all entries are included.
 * @returns A nested object constructed from the entries, or undefined if no entries matched the
 * root path.
 */
export function buildObjectFromEntries(entries: Iterable<[string, unknown]>, rootPath: string): Record<string, unknown> | undefined {
  const root: Record<string, unknown> = {};
  const prefix = rootPath ? rootPath + "." : "";
  let found = false;

  for (const [path, value] of entries) {
    if (rootPath && path !== rootPath && !path.startsWith(prefix)) continue;
    if (!rootPath && !path) continue;

    const relative = rootPath ? (path === rootPath ? "" : path.slice(prefix.length)) : path;
    if (!relative) {
      if (isPlainObjectValue(value)) Object.assign(root, value);
      continue;
    }

    const parts = relative.split(".").filter(Boolean);
    if (!parts.length) continue;

    let cursor: Record<string, unknown> = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;
      if (i === parts.length - 1) {
        cursor[part] = value;
        found = true;
      } else {
        if (!isPlainObjectValue(cursor[part])) cursor[part] = {};
        cursor = cursor[part] as Record<string, unknown>;
      }
    }
  }

  return found || Object.keys(root).length ? root : undefined;
}
