# Coercers

Coercers transform incoming values before commit.

```ts
omni.coercer("label", (_path, value) => {
  return typeof value === "string" ? value.trim() : value;
});
```

## Coercers run before schema validation

```ts
omni.schema("width", { type: "number" });

omni.coercer("width", (_path, value) => {
  if (value === "auto") return 100;
  return value;
});

omni.set("width", "auto"); // stores 100
```

## `NO_COERCE`

A coercer can return `NO_COERCE` to say it made no change.

```ts
import { NO_COERCE } from "omniturbo";

omni.coercer("x", (_path, value) => {
  if (value == null) return NO_COERCE;
  return value;
});
```

## Once coercers

```ts
omni.coercer("x", (_path, value) => normalize(value), {
  once: true,
});
```

## Coercers vs datatypes

Use datatype coercion for reusable type behavior.

Use path coercers for local path behavior.

Example:

```ts
// datatype: every hex color
omni.dataTypes.register({ name: "hexColor", coerce: normalizeHex });

// path coercer: this one path has legacy input support
omni.coercer("theme.primary", legacyThemeColorMapper);
```
