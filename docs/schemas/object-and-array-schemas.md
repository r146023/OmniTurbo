# Object and array schemas

## Object schemas

```ts
omni.schema("node.meta", {
  type: "object",
  children: {
    width: { type: "number", min: 1 },
    height: { type: "number", min: 1 },
    label: { type: "string", maxLength: 120 },
  },
});
```

Then:

```ts
omni.set("node.meta.width", 250);     // accepted
omni.set("node.meta.width", "bad");  // rejected
```

## Object initialization

```ts
omni.setObj({
  width: 100,
  height: 80,
  label: "Node",
}, "node.meta");
```

Each flattened child write goes through its resolved schema.

## Strict objects

`strictObject` is intended for rejecting undeclared children.

```ts
omni.schema("node.meta", {
  type: "object",
  strictObject: true,
  children: {
    width: { type: "number" },
    height: { type: "number" },
  },
});
```

If strict enforcement is implemented, this should reject:

```ts
omni.set("node.meta.random", 123);
```

## Array schemas

```ts
omni.schema("selection.ids", {
  type: "array",
  items: { type: "string" },
});
```

The path itself must be an array:

```ts
omni.set("selection.ids", ["node_1", "node_2"]);
```

Numeric child paths can use the `items` schema:

```ts
omni.set("selection.ids.0", "node_1");
```

## Arrays in setObj

`setObj()` preserves arrays.

```ts
omni.setObj({ ids: ["a", "b"] }, "selection");

omni.get("selection.ids"); // ["a", "b"]
```

It does not automatically flatten to:

```txt
selection.ids.0
selection.ids.1
```

That is intentional. Arrays are usually better treated as a single value unless index-level state is specifically needed.
