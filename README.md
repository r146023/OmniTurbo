# OmniTurbo

**Governed path-state for TypeScript apps.**

OmniTurbo is a path-first state store that can be used in two ways:

1. as a loose in-memory value bag, or
2. as a governed in-memory path database with schemas, datatypes, privacy, structured results, subscriptions, alerts, coercers, batch initialization, and history.

The core design goal is:

> **Freedom by default. Guarantees by request.**

Use OmniTurbo when state is more than temporary UI state — when paths represent metadata, plugin settings, schema definitions, form values, editor entities, or other application-critical data that should be validated before it becomes observable state.

## Why OmniTurbo?

Most state stores let anything write anything:

```ts
store.set("entities.node_1.meta.width", "banana");
```

That is fine for loose state, but it is dangerous when the value represents governed application metadata.

OmniTurbo lets important paths define rules:

```ts
omni.schema("entities.*.meta.width", {
  type: "number",
  min: 1,
  max: 5000,
  coerce: true,
});

omni.set("entities.node_1.meta.width", "250");    // accepted, stores 250
omni.set("entities.node_1.meta.width", "banana"); // rejected, old value remains
```

If validation fails, the value is not committed and side effects do not fire.

## Core guarantee

When a path is governed by schema or privacy and a write fails, OmniTurbo should not:

- update the stored value,
- trigger subscriptions,
- trigger alerts,
- resolve waiters,
- add false successful state to the timeline.

Invalid state should not become observable state.

## Install

```bash
npm install @r146023/omniturbo
```


## Quick start

```ts
import { Omni } from "omniturbo";

const omni = new Omni();

const result = omni.set("settings.theme", "dark");

if (result.success) {
  console.log(omni.get("settings.theme")); // "dark"
}
```

`set()` and `setObj()` return `OmniResult` objects instead of booleans. This is deliberate: once a write can be coerced, rejected, privacy-blocked, or partially applied, a boolean is not enough information.

```ts
const result = omni.set("settings.zoom", "1.25", {
  schema: { type: "number", min: 0.1, max: 4 },
});

console.log(result.success); // true
console.log(result.value);   // 1.25
```

## Governed paths

Schemas can be registered by exact path or wildcard path.

```ts
omni.schema("entities.*.meta", {
  type: "object",
  children: {
    width: {
      type: "number",
      min: 1,
      max: 5000,
      coerce: true,
    },
    height: {
      type: "number",
      min: 1,
      max: 5000,
      coerce: true,
    },
    label: {
      type: "string",
      maxLength: 120,
      coerce: true,
    },
    locked: {
      type: "boolean",
      coerce: true,
    },
  },
});

omni.set("entities.node_1.meta.width", "250"); // accepted
omni.set("entities.node_1.meta.width", "bad"); // rejected
```

## Private paths

Private paths can only be updated through the setter returned when the private path is created.

```ts
const created = omni.set("entities.node_1.meta.locked", false, {
  privateSet: true,
  owner: "AmberNode:node_1",
});

omni.set("entities.node_1.meta.locked", true); // rejected

created.setter?.(true); // accepted
```

Private setters can also write child paths:

```ts
const meta = omni.setObj(
  { width: 100, height: 80, label: "Node" },
  "entities.node_1.meta",
  { privateSet: true, owner: "AmberNode:node_1" }
);

meta.setter?.("width", 250);   // accepted
omni.set("entities.node_1.meta.width", 300); // rejected
```

## Batch initialization

Batching is intended for initialization and bulk loading. It lets an app load a large state tree without firing thousands of startup-time subscriptions.

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
  omni.set("session.ready", true);
});
```

By default, batch commits values but suppresses per-path subscriptions and alerts during initialization.

## Subscriptions

```ts
const unsubscribe = omni.subscribe("settings.theme", (path, value, oldValue) => {
  console.log(path, value, oldValue);
});

omni.set("settings.theme", "light");

unsubscribe();
```

Tree subscriptions can watch descendants:

```ts
omni.subscribeTree("entities.node_1.meta", (root, changedPath, value) => {
  console.log(`${changedPath} changed under ${root}`);
});
```

## Useful for

OmniTurbo is most useful for applications where state needs structure and guarantees:

- visual editors
- plugin-driven apps
- form engines
- schema-driven UIs
- internal tool builders
- metadata-heavy apps
- local-first apps
- desktop apps
- diagram/canvas editors
- generated app systems

It is probably overkill for simple UI flags like `isDropdownOpen`.

## What changed in the modular Omni

The old single-file OmniTurbo was refactored into a modular project structure:

```txt
omniturbo/
  src/
    index.ts
    Omni.ts
    core/
    types/
    result/
    datatypes/
    schema/
    privacy/
    aliases/
    subscriptions/
    history/
    batch/
  tests/
  docs/
```

The most important API change is that `set()` and `setObj()` now return `OmniResult` objects instead of booleans.

## Documentation map

### Getting started

- [Installation](docs/getting-started/installation.md)
- [Quick start](docs/getting-started/quick-start.md)
- [Mental model](docs/getting-started/mental-model.md)
- [Project structure](docs/getting-started/project-structure.md)
- [Migration guide](docs/getting-started/migration-guide.md)

### Concepts

- [Paths and values](docs/concepts/paths-and-values.md)
- [Atomic values vs object trees](docs/concepts/atomic-values-vs-object-trees.md)
- [Results and issues](docs/concepts/results-and-issues.md)
- [Governed vs loose mode](docs/concepts/governed-vs-loose-mode.md)
- [Side-effect lifecycle](docs/concepts/side-effect-lifecycle.md)

### API

- [Omni class](docs/api/omni-class.md)
- [Set and setObj](docs/api/set-and-setobj.md)
- [Get and getObj](docs/api/get-and-getobj.md)
- [Delete and clear](docs/api/delete-and-clear.md)
- [Utility methods](docs/api/utility-methods.md)
- [Explain and export](docs/api/explain-and-export.md)

### Schemas and datatypes

- [Schema basics](docs/schemas/schema-basics.md)
- [Schema resolution and wildcards](docs/schemas/schema-resolution-and-wildcards.md)
- [Object and array schemas](docs/schemas/object-and-array-schemas.md)
- [Validation and coercion pipeline](docs/schemas/validation-and-coercion-pipeline.md)
- [Built-in datatypes](docs/datatypes/built-in-datatypes.md)
- [Custom datatypes](docs/datatypes/custom-datatypes.md)

### Privacy

- [Private paths](docs/privacy/private-paths.md)
- [Write tokens and private setters](docs/privacy/write-tokens-and-private-setters.md)
- [Delete policies](docs/privacy/delete-policies.md)
- [Ownership patterns](docs/privacy/ownership-patterns.md)

### Side effects, batch, and history

- [Subscriptions](docs/subscriptions/subscriptions.md)
- [Alerts](docs/subscriptions/alerts.md)
- [Coercers](docs/subscriptions/coercers.md)
- [Waiters](docs/subscriptions/waiters.md)
- [Batch initialization](docs/batch-history/batch-initialization.md)
- [History and undo](docs/batch-history/history-and-undo.md)
- [Timeline](docs/batch-history/timeline.md)

### Recipes

- [Large app initialization](docs/recipes/large-app-initialization.md)
- [Form state](docs/recipes/form-state.md)
- [Settings and preferences](docs/recipes/settings-and-preferences.md)
- [Metadata enforcement](docs/recipes/metadata-enforcement.md)
- [Plugin-safe state](docs/recipes/plugin-safe-state.md)
- [Debugging invalid writes](docs/recipes/debugging-invalid-writes.md)

### Amber integration

- [Amber metadata integration](docs/amber/amber-metadata-integration.md)
- [Replacing MetaProps enforcement](docs/amber/replacing-metaprops-enforcement.md)
- [Entity-owned private metadata](docs/amber/entity-owned-private-metadata.md)

### Testing and internals

- [Testing Omni](docs/testing/testing-omni.md)
- [Writing tests for governed paths](docs/testing/writing-governed-path-tests.md)
- [Internal architecture](docs/internals/internal-architecture.md)
- [Extension points](docs/internals/extension-points.md)
- [Gotchas](docs/reference/gotchas.md)
- [Glossary](docs/reference/glossary.md)

## Status

OmniTurbo is currently pre-1.0.

The core direction is stable, but schema, privacy, datatype, and result APIs may evolve as the library is battle-tested in real applications.

Recommended versioning:

```txt
0.1.x = experimental / early adopters
0.2.x = API cleanup and adapters
0.3.x = Amber integration proof
1.0.0 = stable public API
```

## License

Apache-2.0 © 2026 Colemen Atwood
