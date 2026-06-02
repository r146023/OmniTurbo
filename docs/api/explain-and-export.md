# Explain and export

## `explain(path)`

`explain()` is a debugging helper.

```ts
const info = omni.explain("entities.node_1.meta.width");
```

Typical data:

```ts
{
  path: "entities.node_1.meta.width",
  value: 250,
  exactValue: 250,
  schema: { ...resolved schema info... },
  privacy: { ...privacy rule... },
  has: true,
  timeline: [ ...timeline entries for the path... ]
}
```

Use it when:

- a write is rejected,
- a schema is not resolving as expected,
- a path appears private unexpectedly,
- subscriptions appear stale,
- you need to inspect runtime governance.

## `export()`

Exports store-adjacent data for inspection or future persistence.

```ts
const snapshot = omni.export();
```

Includes:

- store entries,
- schemas,
- privacy rules,
- aliases,
- timeline.

## Important warning

`export()` is not yet a full persistence contract unless you intentionally make it one.

Things to consider before treating it as durable storage:

- functions cannot be serialized,
- schemas with `RegExp` or function validators need custom handling,
- private setters cannot be restored as-is,
- subscriptions/alerts/coercers should usually be registered by code, not restored from data.

For production persistence, create explicit `save()`/`load()` semantics.
