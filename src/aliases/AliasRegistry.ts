import { normalizePath } from "../core/path";

export class AliasRegistry {
  private aliases = new Map<string, string>();

  set(alias: string, path: string): void {
    const key = alias.startsWith("@") ? alias : `@${alias}`;
    this.aliases.set(key, normalizePath(path));
  }

  remove(alias: string): void {
    const key = alias.startsWith("@") ? alias : `@${alias}`;
    this.aliases.delete(key);
  }

  resolve(path: string): string {
    if (!path.startsWith("@")) return normalizePath(path);
    const [alias, ...rest] = path.split(".");
    if (!alias) throw new Error(`Invalid Omni path: ${path}`);
    const root = this.aliases.get(alias);
    if (!root) throw new Error(`Unknown Omni alias: ${alias}`);
    return normalizePath([root, ...rest].join("."));
  }

  list(): Record<string, string> {
    return Object.fromEntries(this.aliases.entries());
  }
}
