# Paths and values

Omni stores values by normalized string paths.

```ts
omni.set("settings.theme", "dark");
omni.set("viewport.zoom", 1.25);
omni.set("entities.node_1.meta.width", 250);
```

## Path rules

A path should be a dot-separated string:

```txt
settings.theme
entities.node_1.meta.width
plugins.snap.settings.enabled
```

Avoid empty segments:

```txt
bad..path
.path
path.
```

The core path utility normalizes duplicate dots and trims outside dots where appropriate, but application code should still produce clean paths.

## Path naming recommendations

Use stable identifiers, not display names:

```ts
// Good
entities.node_1.meta.width

// Bad
entities.My Fancy Node.meta.width
```

Use domain roots:

```txt
settings.*
viewport.*
entities.*
plugins.*
commands.*
selection.*
```

## Values

A value can be anything in loose mode:

```ts
omni.set("cache.anything", new Map());
```

But governed schemas usually expect JSON-like values:

- string,
- number,
- boolean,
- object,
- array,
- null,
- undefined.

## Exact path value vs object tree

This is a critical distinction.

```ts
omni.set("user", { name: "Ada" });
```

This stores an atomic object at `user`.

```ts
omni.get("user");      // { name: "Ada" }
omni.get("user.name"); // undefined
```

This stores addressable child paths:

```ts
omni.setObj({ name: "Ada" }, "user");

omni.get("user.name"); // "Ada"
omni.getObj("user");   // { name: "Ada" }
```

## Wildcard paths

Schemas support wildcards:

```ts
omni.schema("entities.*.meta.width", { type: "number" });
```

This matches:

```txt
entities.node_1.meta.width
entities.node_2.meta.width
```

It does not match extra-depth paths:

```txt
entities.node_1.something.meta.width
```

## Aliases

Aliases let you create named path roots.

```ts
omni.aliases.set("selected", "entities.node_1");

omni.get("@selected.meta.width");
omni.set("@selected.meta.width", 250);
```

Aliases are purely ergonomic. Omni resolves them before operating on the store.
