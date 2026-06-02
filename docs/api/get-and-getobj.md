# get and getObj

## `get(path, options?)`

Retrieves an exact path value.

```ts
omni.set("settings.theme", "dark");

omni.get("settings.theme"); // "dark"
```

## Clone options

```ts
omni.get("path", { clone: "none" });
omni.get("path", { clone: "shallow" });
omni.get("path", { clone: "deep" });
```

Use cloning when you do not want callers to mutate stored object references.

```ts
const settings = omni.get("settings", { clone: "deep" });
```

## `getObj(path, options?)`

Rebuilds a subtree from child paths.

```ts
omni.set("user.name.first", "Ada");
omni.set("user.name.last", "Lovelace");

omni.getObj("user");
// { name: { first: "Ada", last: "Lovelace" } }
```

## `get(..., { asObject: true })`

```ts
omni.get("user", { asObject: true });
```

This returns the exact value if one exists at `user`; otherwise it attempts to rebuild from children.

## `getMany(paths)`

```ts
const values = omni.getMany([
  "settings.theme",
  "settings.zoom",
]);
```

Result:

```ts
{
  "settings.theme": "dark",
  "settings.zoom": 1.25
}
```

## Missing values

Missing paths return `undefined`.

```ts
omni.get("missing.path"); // undefined
```

## Alias paths

```ts
omni.aliases.set("selected", "entities.node_1");

omni.get("@selected.meta.width");
```
