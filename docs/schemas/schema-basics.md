# Schema basics

Schemas define rules for paths.

```ts
omni.schema("settings.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
  coerce: true,
});
```

## Basic schema shape

```ts
type OmniSchema = {
  type?: OmniDataTypeName;
  required?: boolean;
  nullable?: boolean;
  default?: unknown | (() => unknown);
  coerce?: boolean | OmniCoercer;
  validate?: OmniValidator | OmniValidator[];

  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  enum?: unknown[];
  pattern?: RegExp | string;

  children?: Record<string, OmniSchema>;
  items?: OmniSchema;
  strictObject?: boolean;
  atomic?: boolean;

  history?: boolean;
  historyLimit?: number;

  privateSet?: boolean;
  readonly?: boolean;
  writeOnce?: boolean;
  deletePolicy?: "anyone" | "owner" | "never";

  onInvalid?: "reject" | "keepOld" | "setDefault";
};
```

## Type validation

```ts
omni.schema("user.name", { type: "string" });
omni.schema("user.age", { type: "integer", min: 0 });
omni.schema("settings.enabled", { type: "boolean" });
```

## Coercion

```ts
omni.schema("user.age", {
  type: "integer",
  coerce: true,
});

omni.set("user.age", "42");
omni.get("user.age"); // 42
```

## Min/max

```ts
omni.schema("viewport.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
});
```

## String length

```ts
omni.schema("node.label", {
  type: "string",
  minLength: 1,
  maxLength: 120,
});
```

## Enum

```ts
omni.schema("node.kind", {
  type: "string",
  enum: ["html", "svg", "group"],
});
```

## Pattern

```ts
omni.schema("plugin.id", {
  type: "string",
  pattern: "^[a-z][a-z0-9-]*$",
});
```

## Custom validator

```ts
omni.schema("node.width", {
  type: "number",
  validate(value) {
    return Number(value) % 2 === 0 || "Width must be even.";
  },
});
```

## Invalid behavior

Default invalid behavior is reject.

```ts
omni.schema("x", { type: "number" });

omni.set("x", 1);
omni.set("x", "bad"); // rejected; x remains 1
```

Alternative behaviors:

```ts
omni.schema("x", {
  type: "number",
  onInvalid: "keepOld",
});
```

```ts
omni.schema("x", {
  type: "number",
  default: 0,
  onInvalid: "setDefault",
});
```
