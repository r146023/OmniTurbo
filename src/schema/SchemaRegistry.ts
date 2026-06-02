import { getPathParts, normalizePath, wildcardScore, wildcardToRegExp } from "../core/path";
import type { OmniResolvedSchema, OmniSchema } from "../types/schema_types";

interface SchemaEntry {
  pattern: string;
  regex: RegExp;
  score: number;
  schema: OmniSchema;
}

/**
 *
 * The SchemaRegistry class manages a collection of schemas associated with path patterns. It allows defining schemas for specific paths, retrieving schemas based on exact patterns, and resolving schemas for given paths by matching them against the defined patterns. The registry supports wildcard patterns and prioritizes more specific matches when resolving schemas.
 *
 * Key features:
 * - Define schemas for specific path patterns, including support for wildcards.
 * - Retrieve schemas based on exact path patterns.
 * - Resolve schemas for given paths by matching them against defined patterns, with support for child schema resolution.
 * - List all defined schemas and clear the registry when needed.
 *
 * This class is essential for managing the structure and validation of data within the Omni system, allowing for flexible schema definitions and efficient retrieval based on path patterns.
 *
 * @example
 * const registry = new SchemaRegistry();
 * registry.define("settings.*", { type: "object", children: { theme: { type: "string" } } });
 * const schema = registry.resolve("settings.theme");
 * console.log(schema); // { type: "string" }
 *
 */
export class SchemaRegistry {
  private entries: SchemaEntry[] = [];

  define(pathPattern: string, schema: OmniSchema): void {
    const pattern = normalizePath(pathPattern);
    const existing = this.entries.find((entry) => entry.pattern === pattern);
    const entry: SchemaEntry = {
      pattern,
      regex: wildcardToRegExp(pattern),
      score: wildcardScore(pattern),
      schema,
    };

    if (existing) Object.assign(existing, entry);
    else this.entries.push(entry);

    this.entries.sort((a, b) => b.score - a.score || b.pattern.length - a.pattern.length);
  }

  getExact(pathPattern: string): OmniSchema | undefined {
    return this.entries.find((entry) => entry.pattern === normalizePath(pathPattern))?.schema;
  }

  resolve(path: string): OmniResolvedSchema | undefined {
    const normalized = normalizePath(path);
    const direct = this.entries.find((entry) => entry.regex.test(normalized));
    if (direct) return { path: normalized, pattern: direct.pattern, schema: direct.schema, score: direct.score };

    return this.resolveChildSchema(normalized);
  }

  private resolveChildSchema(path: string): OmniResolvedSchema | undefined {
    const parts = getPathParts(path);
    const candidates: OmniResolvedSchema[] = [];

    for (const entry of this.entries) {
      const patternParts = getPathParts(entry.pattern);
      if (patternParts.length >= parts.length) continue;

      let matchesParent = true;
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i] !== "*" && patternParts[i] !== parts[i]) {
          matchesParent = false;
          break;
        }
      }
      if (!matchesParent) continue;

      let schema: OmniSchema | undefined = entry.schema;
      for (let i = patternParts.length; i < parts.length; i++) {
        if (!schema) break;
        const part = parts[i] ?? "";
        if (schema.type === "array" && schema.items && /^\d+$/.test(part)) {
          schema = schema.items;
          continue;
        }
        schema = schema.children?.[part] ?? schema.children?.["*"];
      }

      if (schema) candidates.push({ path, pattern: entry.pattern, schema, score: entry.score + patternParts.length });
    }

    candidates.sort((a, b) => b.score - a.score || b.pattern.length - a.pattern.length);
    return candidates[0];
  }

  list(): Array<{ pattern: string; schema: OmniSchema }> {
    return this.entries.map(({ pattern, schema }) => ({ pattern, schema }));
  }

  clear(): void {
    this.entries = [];
  }
}
