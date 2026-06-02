# Custom datatypes

Custom datatypes let you reuse validation/coercion behavior across schemas.

## Register a datatype

```ts
omni.dataTypes.register({
  name: "positiveNumber",
  base: "number",
  coerce(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : OMNI_REJECT;
  },
  validate(value) {
    return typeof value === "number" && value > 0 || "Value must be positive.";
  },
});
```

Use it:

```ts
omni.schema("node.width", {
  type: "positiveNumber",
  max: 5000,
});
```

## Return values from coercers

A datatype coercer can return:

- the coerced value,
- `NO_COERCE`,
- `OMNI_REJECT`.

```ts
import { OMNI_REJECT, NO_COERCE } from "omniturbo";
```

Example:

```ts
omni.dataTypes.register({
  name: "cssPx",
  coerce(value) {
    if (typeof value === "number") return `${value}px`;
    if (typeof value === "string" && /^\d+(\.\d+)?px$/.test(value)) return value;
    return OMNI_REJECT;
  },
  validate(value) {
    return typeof value === "string" && /^\d+(\.\d+)?px$/.test(value);
  },
});
```

## Amber datatype examples

### Entity ID

```ts
omni.dataTypes.register({
  name: "Amber.entityId",
  validate(value) {
    return typeof value === "string" && /^[a-z]+_[a-zA-Z0-9_-]+$/.test(value)
      || "Invalid Amber entity id.";
  },
});
```

### Hex color

```ts
omni.dataTypes.register({
  name: "Amber.color.hex",
  coerce(value) {
    if (typeof value !== "string") return OMNI_REJECT;
    let v = value.trim();
    if (/^[0-9a-fA-F]{6}$/.test(v)) v = `#${v}`;
    return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : OMNI_REJECT;
  },
  validate(value) {
    return typeof value === "string" && /^#[0-9a-f]{6}$/.test(value);
  },
});
```

### Plugin ID

```ts
omni.dataTypes.register({
  name: "Amber.pluginId",
  validate(value) {
    return typeof value === "string" && /^[a-z][a-z0-9.-]*$/.test(value)
      || "Plugin id must be lowercase dot/dash notation.";
  },
});
```

## Best practices

- Keep datatype behavior reusable and generic.
- Put path-specific rules in schemas.
- Return clear issue messages from validators.
- Do not hide expensive work in datatype validators.
- Prefer deterministic coercion.
