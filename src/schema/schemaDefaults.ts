import type { OmniSchema } from "../types/schema_types";

export function resolveDefault(schema: OmniSchema | undefined): unknown {
  if (!schema || !("default" in schema)) return undefined;
  return typeof schema.default === "function" ? (schema.default as () => unknown)() : schema.default;
}
