import { isPrimitive } from "./object";

/**
 * Performs a fast equality check between two values.
 * Handles primitives, arrays, dates, and plain objects efficiently.
 */
export const fastEquals = (a: unknown, b: unknown): boolean => {
  const isDateTimeA = typeof a === "object" && a !== null && typeof (a as Date).toISOString === "function";
  const isDateTimeB = typeof b === "object" && b !== null && typeof (b as Date).toISOString === "function";
  if (isDateTimeA && isDateTimeB) return (a as Date).toISOString() === (b as Date).toISOString();
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (isPrimitive(a)) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!fastEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === "object" && typeof b === "object") {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(bObj, key) || !fastEquals(aObj[key], bObj[key])) return false;
    }
    return true;
  }

  return false;
};
