# set and setObj

## `set(path, value, options?)`

Writes one value to one path.

```ts
const result = omni.set("settings.theme", "dark");
```

Returns `OmniResult`.

```ts
if (!result.success) {
  console.table(result.issues);
}
```

## Common set options

```ts
omni.set("x", value, {
  immediate?: boolean;
  history?: boolean;
  historyLimit?: number;
  clone?: "none" | "shallow" | "deep";
  silent?: boolean;
  suppressTimeline?: boolean;
  asObject?: boolean;
  pushToArray?: boolean;

  schema?: OmniSchema;
  privateSet?: boolean;
  owner?: string;
  deletePolicy?: "anyone" | "owner" | "never";
  token?: OmniWriteToken;

  validate?: boolean;
  coerce?: boolean;
});
```

## Atomic object set

```ts
omni.set("cache.raw", { a: 1 });

omni.get("cache.raw");   // { a: 1 }
omni.get("cache.raw.a"); // undefined
```

## Object mode set

```ts
omni.set("cache.raw", { a: 1 }, { asObject: true });

omni.get("cache.raw.a"); // 1
```

## `setObj(object, pathPrefix?, options?)`

Flattens a plain object into child paths.

```ts
omni.setObj({
  width: 100,
  height: 80,
}, "node.meta");

omni.get("node.meta.width"); // 100
```

## `setObj()` result children

```ts
const result = omni.setObj({ width: 100, height: "bad" }, "node.meta");

for (const child of result.children ?? []) {
  console.log(child.path, child.success);
}
```

## `privateSet`

```ts
const result = omni.set("secure.value", 1, {
  privateSet: true,
  owner: "MyOwner",
});

result.setter!(2);      // allowed
omni.set("secure.value", 3); // rejected
```

## `pushToArray`

```ts
omni.set("items", [1, 2]);
omni.set("items", [3, 4], { pushToArray: true });

omni.get("items"); // [1, 2, 3, 4]
```

## `canSet()` dry run

```ts
const result = omni.canSet("settings.zoom", "2");

console.log(result.success); // true
console.log(result.value);   // 2
console.log(omni.get("settings.zoom")); // unchanged
```
