# OmniTurbo Documentation

OmniTurbo is a path-first state store that can behave like either:

1. a loose in-memory value bag, or
2. a governed in-memory path database with schemas, datatypes, privacy, structured results, subscriptions, alerts, coercers, batch initialization, and history.

The core design goal is simple:

> Freedom by default. Guarantees by request.

If you want a keypath to accept anything, Omni allows that. If you want a keypath to behave like a database column with type constraints, coercion, validation, privacy ownership, and predictable side effects, Omni can enforce that too.

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

```ts
const result = omni.set("settings.zoom", "1.25", {
  schema: { type: "number", min: 0.1, max: 4 },
});

if (result.success) {
  console.log(result.value); // 1.25
}
```

That is deliberate. Once Omni supports schemas, coercion, privacy, and validation, a boolean is not enough information.

## Documentation map

### Getting started

- [Installation](getting-started/installation.md)
- [Quick start](getting-started/quick-start.md)
- [Mental model](getting-started/mental-model.md)
- [Project structure](getting-started/project-structure.md)
- [Migration guide](getting-started/migration-guide.md)

### Concepts

- [Paths and values](concepts/paths-and-values.md)
- [Atomic values vs object trees](concepts/atomic-values-vs-object-trees.md)
- [Results and issues](concepts/results-and-issues.md)
- [Governed vs loose mode](concepts/governed-vs-loose-mode.md)
- [Side-effect lifecycle](concepts/side-effect-lifecycle.md)

### API

- [Omni class](api/omni-class.md)
- [Set and setObj](api/set-and-setobj.md)
- [Get and getObj](api/get-and-getobj.md)
- [Delete and clear](api/delete-and-clear.md)
- [Utility methods](api/utility-methods.md)
- [Explain and export](api/explain-and-export.md)

### Schemas and datatypes

- [Schema basics](schemas/schema-basics.md)
- [Schema resolution and wildcards](schemas/schema-resolution-and-wildcards.md)
- [Object and array schemas](schemas/object-and-array-schemas.md)
- [Validation and coercion pipeline](schemas/validation-and-coercion-pipeline.md)
- [Built-in datatypes](datatypes/built-in-datatypes.md)
- [Custom datatypes](datatypes/custom-datatypes.md)

### Privacy

- [Private paths](privacy/private-paths.md)
- [Write tokens and private setters](privacy/write-tokens-and-private-setters.md)
- [Delete policies](privacy/delete-policies.md)
- [Ownership patterns](privacy/ownership-patterns.md)

### Side effects, batch, and history

- [Subscriptions](subscriptions/subscriptions.md)
- [Alerts](subscriptions/alerts.md)
- [Coercers](subscriptions/coercers.md)
- [Waiters](subscriptions/waiters.md)
- [Batch initialization](batch-history/batch-initialization.md)
- [History and undo](batch-history/history-and-undo.md)
- [Timeline](batch-history/timeline.md)

### Recipes

- [Large app initialization](recipes/large-app-initialization.md)
- [Form state](recipes/form-state.md)
- [Settings and preferences](recipes/settings-and-preferences.md)
- [Metadata enforcement](recipes/metadata-enforcement.md)
- [Plugin-safe state](recipes/plugin-safe-state.md)
- [Debugging invalid writes](recipes/debugging-invalid-writes.md)

### Amber integration

- [Amber metadata integration](amber/amber-metadata-integration.md)
- [Replacing MetaProps enforcement](amber/replacing-metaprops-enforcement.md)
- [Entity-owned private metadata](amber/entity-owned-private-metadata.md)

### Testing and internals

- [Testing Omni](testing/testing-omni.md)
- [Writing tests for governed paths](testing/writing-governed-path-tests.md)
- [Internal architecture](internals/internal-architecture.md)
- [Extension points](internals/extension-points.md)
- [Gotchas](reference/gotchas.md)
- [Glossary](reference/glossary.md)

## Minimum useful example

```ts
import { Omni } from "omniturbo";

const omni = new Omni();

omni.schema("entities.*.meta.width", {
  type: "number",
  min: 1,
  max: 5000,
  coerce: true,
});

const result = omni.set("entities.node_1.meta.width", "250");

console.log(result.success); // true
console.log(result.value);   // 250
console.log(omni.get("entities.node_1.meta.width")); // 250

const rejected = omni.set("entities.node_1.meta.width", "banana");

console.log(rejected.success); // false
console.log(omni.get("entities.node_1.meta.width")); // still 250
```

## Core guarantee

When a path is governed by schema/privacy and a write fails, Omni should not:

- update the stored value,
- trigger subscriptions,
- trigger alerts,
- resolve waiters,
- add false successful state to the timeline.

Invalid state should not become observable state.
