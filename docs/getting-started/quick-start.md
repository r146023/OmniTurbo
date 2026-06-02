# Quick start

## Create a store

```ts
import { Omni } from "omniturbo";

const omni = new Omni();
```

## Set and get loose values

By default, Omni behaves like a permissive path-value store.

```ts
omni.set("settings.theme", "dark");
omni.set("viewport.zoom", 1.25);

console.log(omni.get("settings.theme")); // "dark"
console.log(omni.get("viewport.zoom"));  // 1.25
```

## Understand set results

`set()` returns an `OmniResult`.

```ts
const result = omni.set("settings.theme", "dark");

console.log(result.success); // true
console.log(result.changed); // true or false
console.log(result.path);    // "settings.theme"
console.log(result.value);   // "dark"
console.log(result.issues);  // []
```

Do this:

```ts
const result = omni.set("x", 1);
if (result.success) {
  // write committed
}
```

Do not write new code like this:

```ts
if (omni.set("x", 1)) {
  // old boolean-style assumption
}
```

## Define a schema

Schemas turn loose paths into governed paths.

```ts
omni.schema("settings.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
  coerce: true,
});
```

Now Omni validates and coerces writes before commit.

```ts
omni.set("settings.zoom", "2");
console.log(omni.get("settings.zoom")); // 2

const result = omni.set("settings.zoom", "massive");
console.log(result.success); // false
console.log(omni.get("settings.zoom")); // still 2
```

## Use wildcard schemas

```ts
omni.schema("entities.*.meta.width", {
  type: "number",
  min: 1,
  max: 5000,
  coerce: true,
});

omni.set("entities.node_1.meta.width", "250");
omni.set("entities.node_2.meta.width", 480);
```

## Store object trees

Use `setObj()` when child paths should be addressable.

```ts
omni.setObj({
  width: 100,
  height: 80,
  label: "Node",
}, "entities.node_1.meta");

console.log(omni.get("entities.node_1.meta.width")); // 100
console.log(omni.getObj("entities.node_1.meta"));
// { width: 100, height: 80, label: "Node" }
```

Use plain `set()` when the object should be atomic.

```ts
omni.set("cache.rawObject", { a: 1, b: 2 });

console.log(omni.get("cache.rawObject")); // { a: 1, b: 2 }
console.log(omni.get("cache.rawObject.a")); // undefined
```

## Private paths

Use `privateSet` when only the creator should write the path/tree.

```ts
const result = omni.setObj(
  { width: 100, height: 80 },
  "entities.node_1.meta",
  { privateSet: true, owner: "AmberNode:node_1" }
);

const setMeta = result.setter!;

omni.set("entities.node_1.meta.width", 200); // rejected
setMeta("width", 200);                       // accepted
```

## Subscribe to changes

```ts
const unsubscribe = omni.subscribe("settings.theme", (path, value, oldValue) => {
  console.log(path, value, oldValue);
});

omni.set("settings.theme", "light");
unsubscribe();
```

## Batch initialization

Batch is for loading a lot of app state without firing thousands of startup-time subscriptions.

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
  omni.set("viewport.pan.x", 0);
  omni.set("viewport.pan.y", 0);
});
```

By default, batch commits values but suppresses per-path subscriptions/alerts during initialization.

## Debug with explain

```ts
console.log(omni.explain("entities.node_1.meta.width"));
```

This gives you value, schema, privacy, and timeline information for a path.
