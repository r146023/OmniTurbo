# Mental model

OmniTurbo is easiest to understand as a path-indexed state graph.

```txt
settings.theme              -> "dark"
settings.zoom               -> 1.25
entities.node_1.meta.width  -> 250
entities.node_1.meta.height -> 120
```

Every value lives at a string path. Paths use dot notation. Omni does not require you to create classes, models, or stores per domain.

## Loose mode

Loose mode is the default.

```ts
omni.set("anything.goes", { deeply: ["whatever"] });
```

There is no schema, no owner, and no strict type enforcement. This is useful for:

- temporary state,
- UI state,
- prototyping,
- caches,
- debug values,
- plugin experiments.

## Governed mode

A path becomes governed when you attach rules to it.

```ts
omni.schema("settings.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
});
```

Now writes to that path are checked before commit.

```ts
omni.set("settings.zoom", 2);      // accepted
omni.set("settings.zoom", "bad"); // rejected
```

Governed mode is useful for:

- metadata,
- entity properties,
- plugin manifests,
- app settings,
- user-editable forms,
- critical runtime state,
- anything that should not silently become invalid.

## Omni as an in-memory database

Omni is not a database. It does not persist by default. But conceptually, a governed path behaves like a database field:

| Database idea | Omni equivalent |
|---|---|
| table column | path schema |
| column type | datatype |
| constraint | validator/min/max/enum/pattern |
| row data | stored path value |
| transaction-ish group | batch/transaction future concept |
| write permission | privacy token/private setter |
| trigger | subscription/alert/coercer |

The useful guarantee is:

> Invalid writes do not become observable state.

## Entity owns intent. Omni owns enforcement.

For Amber, this is the key architecture.

Bad pattern:

```ts
entity.meta.width.set(250);       // validates
omni.set("entity.meta.width", {}); // bypasses validation
```

Better pattern:

```ts
const meta = omni.setObj(defaultMeta, path, {
  schema: AmberNodeMetaSchema,
  privateSet: true,
});

meta.setter!("width", 250); // entity-owned write
```

The entity controls intent and ownership. Omni controls rules and enforcement.

## Side effects happen after commit

Subscriptions, alerts, waiters, and timeline entries should represent committed state.

The intended pipeline is:

```txt
incoming value
  -> privacy check
  -> coercers
  -> datatype coercion
  -> schema coercion
  -> datatype validation
  -> schema validation
  -> commit
  -> history/timeline
  -> subscriptions
  -> alerts
  -> waiters
  -> result
```

If the write fails before commit, side effects should not fire.

## One store, many domains

Omni should not know what an Amber node is. It only needs to know paths and rules.

```txt
entities.node_1.meta.width
plugins.snap.settings.enabled
viewport.zoom
commands.active.id
selection.ids
```

Amber, KaiKai, or any other app can build domain managers around those paths without duplicating enforcement logic.
