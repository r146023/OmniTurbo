# Atomic values vs object trees

Omni supports two different ways to store objects.

## Atomic object

```ts
omni.set("node.meta", {
  width: 100,
  height: 80,
});
```

This stores the object as one value at `node.meta`.

```ts
omni.get("node.meta");       // { width: 100, height: 80 }
omni.get("node.meta.width"); // undefined
```

Use atomic objects when:

- the object should be replaced as a whole,
- child subscriptions are not needed,
- child schemas are not needed,
- the object is a cache blob,
- you do not want child paths to exist.

## Object tree

```ts
omni.setObj({
  width: 100,
  height: 80,
}, "node.meta");
```

This flattens the object into child paths.

```txt
node.meta.width  -> 100
node.meta.height -> 80
```

Now:

```ts
omni.get("node.meta.width"); // 100
omni.getObj("node.meta");    // { width: 100, height: 80 }
```

Use object trees when:

- child values need subscriptions,
- child values need schemas,
- child values need independent history,
- metadata should be addressable,
- plugin authors need predictable path access.

## `set(..., { asObject: true })`

This is equivalent to `setObj()` for plain objects.

```ts
omni.set("node.meta", { width: 100 }, { asObject: true });
```

If the value is not a plain object, Omni rejects it.

## Arrays are preserved

`setObj()` flattens plain objects but preserves arrays.

```ts
omni.setObj({
  tags: ["node", "selected"],
}, "entity.meta");

omni.get("entity.meta.tags"); // ["node", "selected"]
```

Arrays are not exploded into `tags.0`, `tags.1` by object flattening. You can still address array-like paths directly if you choose:

```ts
omni.set("items.0", "first");
```

## Overwriting trees

When an atomic value is written over a parent path, children should be removed.

```ts
omni.setObj({ child: { value: 1 } }, "root");

omni.set("root", "atomic");

omni.get("root");             // "atomic"
omni.get("root.child.value"); // undefined
```

This avoids stale child state remaining under a path that is now atomic.
