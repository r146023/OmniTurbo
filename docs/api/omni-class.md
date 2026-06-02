# Omni class

```ts
import { Omni } from "omniturbo";

const omni = new Omni();
```

The `Omni` class owns the store and composes these public registries:

```ts
omni.dataTypes
omni.schemas
omni.privacy
omni.aliases
omni.subscriptions
omni.timeline
```

Most application code should use the top-level `omni` methods instead of directly using registries, except for advanced registration tasks.

## Core methods

```ts
omni.set(path, value, options?)
omni.setObj(object, pathPrefix?, options?)
omni.get(path, options?)
omni.getObj(path, options?)
omni.delete(path, options?)
omni.clear()
```

## Governance methods

```ts
omni.schema(pathPattern, schema)
omni.define(pathPattern, schema)
omni.getSchema(path)
omni.canSet(path, value, options?)
```

`define()` is an alias-style method for schema definition.

## Side-effect methods

```ts
omni.subscribe(path, callback, type?)
omni.subscribeTree(prefix, callback, type?)
omni.subscribeGlobal(callback, options?)
omni.alert(path, callback, options?)
omni.coercer(path, callback, options?)
omni.waitFor(paths, exclude?)
```

## Utility methods

```ts
omni.has(path, types?)
omni.exists(path)
omni.isType(path, types)
omni.isPlainObject(path)
omni.getMany(paths)
omni.toggle(path)
omni.increment(path, amount?)
omni.decrement(path, amount?)
omni.undo(path)
omni.explain(path)
omni.export()
```

## Feature control

```ts
omni.setParentNotifications(true | false)
```

Parent notifications are a semantic choice. If enabled, subscribers on parent paths may be notified when child paths change.

## Suggested app singleton

```ts
// state/omni.ts
import { Omni } from "omniturbo";

export const omni = new Omni();
```

For Amber, this should probably be the primary app state graph.
