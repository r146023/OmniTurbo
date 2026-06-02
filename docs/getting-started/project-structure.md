# Project structure

OmniTurbo is split by responsibility, not by tiny function.

```txt
src/
  index.ts
  Omni.ts

  core/
    path.ts
    object.ts
    equality.ts
    ids.ts

  types/
    result_types.ts
    issue_types.ts
    schema_types.ts
    datatype_types.ts
    privacy_types.ts
    store_types.ts
    options_types.ts

  result/
    resultFactories.ts

  datatypes/
    DataTypeRegistry.ts
    builtins.ts

  schema/
    SchemaRegistry.ts
    schemaDefaults.ts
    schemaValidation.ts

  privacy/
    PrivacyRegistry.ts
    writeTokens.ts

  aliases/
    AliasRegistry.ts

  subscriptions/
    subscriptions.ts

  history/
    history.ts
    timeline.ts

  batch/
    batch.ts
```

## `Omni.ts`

The main class. It composes the registries and owns the store.

Responsibilities:

- public API,
- path normalization through aliases,
- set/get/delete/batch behavior,
- validation pipeline orchestration,
- privacy checks,
- notification timing,
- history/timeline integration.

`Omni.ts` should not become a junk drawer again. When behavior becomes domain-heavy, push the domain rules into a registry/module.

## `core/`

Small pure utilities.

- `path.ts`: normalize paths, join paths, wildcard matching, parent paths.
- `object.ts`: flatten objects, rebuild object trees, clone values.
- `equality.ts`: fast equality checks.
- `ids.ts`: lightweight ID creation.

These should stay dependency-light and easy to test.

## `types/`

Public and internal contracts.

Important files:

- `result_types.ts`: `OmniResult`.
- `issue_types.ts`: `OmniIssue`.
- `schema_types.ts`: `OmniSchema`.
- `datatype_types.ts`: datatype/coercer contracts.
- `privacy_types.ts`: write tokens/private setters.
- `options_types.ts`: set/get/batch options.
- `store_types.ts`: internal value/timeline shape.

## `result/`

Result construction helpers.

```ts
okResult(...)
failResult(...)
mergeResults(...)
```

Keep these boring and predictable.

## `datatypes/`

Datatype definitions and registry.

A datatype answers:

- How can this value be coerced?
- How can this value be validated?
- What is this datatype called?

## `schema/`

Schema registry and validation logic.

A schema answers:

- Which datatype should a path use?
- Are there min/max/enum/pattern rules?
- What are child path schemas?
- Is this path readonly/write-once/private?
- What happens when validation fails?

## `privacy/`

Capability-style write enforcement.

Important concepts:

- private path,
- write token,
- private setter,
- delete policy.

## `aliases/`

Named path roots.

```ts
omni.aliases.set("selected", "entities.node_123");
omni.get("@selected.meta.width");
```

## `subscriptions/`

Side-effect systems:

- direct subscriptions,
- tree subscriptions,
- global subscriptions,
- alerts,
- coercers.

## `history/`

Per-path undo history and global timeline.

These are deliberately separate concepts:

- history helps restore path values,
- timeline helps inspect changes.

## `batch/`

Bulk initialization helpers.

Batch is not an efficiency mode. It is a semantic operation for applying many state changes without firing unnecessary startup-time side effects.
