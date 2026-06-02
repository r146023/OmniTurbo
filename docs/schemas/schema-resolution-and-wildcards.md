# Schema resolution and wildcards

Schemas are stored by path pattern.

```ts
omni.schema("entities.*.meta.width", { type: "number" });
```

## Exact schemas

```ts
omni.schema("settings.zoom", { type: "number" });
```

Matches only:

```txt
settings.zoom
```

## Wildcard schemas

```ts
omni.schema("entities.*.meta.width", { type: "number" });
```

Matches:

```txt
entities.node_1.meta.width
entities.node_2.meta.width
entities.link_7.meta.width
```

Does not match:

```txt
entities.node_1.meta.size.width
entities.node_1.width
```

A `*` wildcard matches exactly one path segment.

## Specificity

More concrete schemas should win over generic schemas.

```ts
omni.schema("entities.*.meta.width", {
  type: "number",
  max: 5000,
});

omni.schema("entities.special.meta.width", {
  type: "integer",
  max: 100,
});
```

For `entities.special.meta.width`, the exact-ish schema wins.

## Parent child schemas

You can define a parent schema with child schemas:

```ts
omni.schema("entities.*.meta", {
  type: "object",
  children: {
    width: { type: "number", min: 1 },
    height: { type: "number", min: 1 },
    label: { type: "string", maxLength: 120 },
  },
});
```

This governs:

```txt
entities.node_1.meta.width
entities.node_1.meta.height
entities.node_1.meta.label
```

## Child wildcard schemas

```ts
omni.schema("settings", {
  type: "object",
  children: {
    "*": { type: "string" },
  },
});
```

All direct children of `settings` are strings.

## Debugging schema resolution

Use:

```ts
omni.getSchema("entities.node_1.meta.width");
omni.explain("entities.node_1.meta.width");
```

If a schema is not resolving:

1. check path spelling,
2. check wildcard segment count,
3. check exact vs parent-child schema placement,
4. check aliases,
5. inspect `omni.schemas.list()`.
