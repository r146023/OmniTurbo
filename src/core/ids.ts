let idCounter = 0;

/**
 * Lightweight unique ID generator for subscribers, alerts, privacy tokens, and views.
 */
export const generateFastId = (prefix = "omni"): string => `${prefix}_${Date.now().toString(36)}_${(++idCounter).toString(36)}`;
