import type { OmniValueObject } from "../types/store_types";

export function ensureHistory(valueObj: OmniValueObject, oldValue: unknown, limit = 10): void {
  if (!valueObj.history) {
    valueObj.history = [oldValue];
    valueObj.historySize = limit;
    valueObj.historyIndex = -1;
    return;
  }

  if (typeof valueObj.historyIndex === "number" && valueObj.historyIndex > -1) {
    valueObj.history.splice(valueObj.history.length - valueObj.historyIndex);
    valueObj.historyIndex = -1;
  }

  if (valueObj.history.length === 0 || valueObj.history[valueObj.history.length - 1] !== oldValue) {
    valueObj.history.push(oldValue);
  }

  const max = valueObj.historySize ?? limit;
  while (valueObj.history.length > max) valueObj.history.shift();
}

export function canUndoValue(valueObj: OmniValueObject | undefined): boolean {
  return !!valueObj?.history?.length;
}
