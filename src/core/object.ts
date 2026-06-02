/**
 * Checks if a value is a primitive (string, number, boolean, null, undefined) or an object.
 */
export const isPrimitive = (val: unknown): boolean => {
  const type = typeof val;
  return val === null || type !== "object";
};

export const isPlainObjectValue = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

// Optimized shallow clone (no deep clone by default)
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
 * Simple object flattener that excludes arrays (treats them as single values).
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
