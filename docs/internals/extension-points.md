# Extension points

## Custom datatypes

```ts
omni.dataTypes.register({
  name: "myType",
  coerce(value) { return value; },
  validate(value) { return true; },
});
```

## Schemas

```ts
omni.schema("my.path", { type: "myType" });
```

## Coercers

```ts
omni.coercer("my.path", (_path, value) => transform(value));
```

## Alerts

```ts
omni.alert("my.path", callback, { condition, once, throttle });
```

## Aliases

```ts
omni.aliases.set("selected", "entities.node_1");
```

## Plugin wrappers

Build narrow APIs around Omni rather than exposing the whole store.

```ts
function createPluginStateApi(pluginId: string) {
  const root = `plugins.${pluginId}`;
  return {
    get(path: string) {
      return omni.get(`${root}.${path}`);
    },
    set(path: string, value: unknown) {
      return omni.set(`${root}.${path}`, value);
    },
  };
}
```

## What not to extend casually

Avoid monkey-patching core `set/get` semantics. Add registries or wrapper APIs instead.
