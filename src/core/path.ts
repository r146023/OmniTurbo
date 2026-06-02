export const normalizePath = (path: string): string => {
  if (typeof path !== "string") throw new Error("Omni path must be a string");
  const normalized = path.trim().replace(/^\.+|\.+$/g, "").replace(/\.{2,}/g, ".");
  if (!normalized) throw new Error("Omni path cannot be empty");
  return normalized;
};

export const joinPath = (...parts: Array<string | undefined | null>): string => {
  return parts.filter((p): p is string => typeof p === "string" && p.trim() !== "").join(".").replace(/\.{2,}/g, ".");
};

export const getPathParts = (path: string): string[] => normalizePath(path).split(".");

export const isChildPath = (rootPath: string, path: string): boolean => {
  const root = normalizePath(rootPath);
  const target = normalizePath(path);
  return target === root || target.startsWith(root + ".");
};

export const getRelativePath = (rootPath: string, path: string): string => {
  const root = normalizePath(rootPath);
  const target = normalizePath(path);
  if (target === root) return "";
  if (!target.startsWith(root + ".")) return target;
  return target.slice(root.length + 1);
};

export const getParentPaths = (path: string): string[] => {
  const parts = getPathParts(path);
  const parents: string[] = [];
  for (let i = parts.length - 1; i > 0; i--) parents.push(parts.slice(0, i).join("."));
  return parents;
};

export const wildcardToRegExp = (pattern: string): RegExp => {
  const escaped = normalizePath(pattern)
    .split(".")
    .map((part) => (part === "*" ? "[^.]+" : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("\\.");
  return new RegExp(`^${escaped}$`);
};

export const wildcardScore = (pattern: string): number => {
  return normalizePath(pattern)
    .split(".")
    .reduce((score, part) => score + (part === "*" ? 1 : 10), 0);
};
