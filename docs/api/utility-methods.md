# Utility methods

## `has(path, types?)`

```ts
omni.has("settings.theme");
omni.has("settings.zoom", "number");
omni.has("entity.ids", ["array", "object"]);
```

## `exists(path)`

Alias-like convenience for checking path existence.

```ts
if (omni.exists("settings.theme")) {}
```

## `isType(path, types)`

```ts
omni.isType("settings.zoom", "number");
omni.isType("items", "array");
omni.isType("maybe", ["string", "undefined"]);
```

## `isPlainObject(path)`

```ts
omni.isPlainObject("node.meta");
```

## `toggle(path)`

```ts
omni.toggle("ui.sidebar.open");
```

If the path is missing, it becomes `true`.

## `increment(path, amount?)`

```ts
omni.increment("counter");
omni.increment("counter", 5);
```

## `decrement(path, amount?)`

```ts
omni.decrement("counter");
omni.decrement("counter", 5);
```

## `waitFor(pathOrPaths, exclude?)`

```ts
await omni.waitFor("app.ready");

await omni.waitFor(["settings.loaded", "plugins.loaded"]);
```

By default, `undefined` and `null` are excluded.

```ts
await omni.waitFor("x", [undefined, null, false]);
```
