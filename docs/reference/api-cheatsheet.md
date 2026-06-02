# API cheatsheet

## Create

```ts
const omni = new Omni();
```

## Set

```ts
omni.set(path, value, options?)
omni.setObj(object, pathPrefix?, options?)
omni.canSet(path, value, options?)
```

## Get

```ts
omni.get(path, options?)
omni.getObj(path, options?)
omni.getMany(paths)
```

## Schema

```ts
omni.schema(pathPattern, schema)
omni.define(pathPattern, schema)
omni.getSchema(path)
```

## Privacy

```ts
omni.set(path, value, { privateSet: true })
omni.setObj(object, path, { privateSet: true })
result.setter!(value)
result.setter!(childPath, value)
```

## Subscribe

```ts
omni.subscribe(path, callback)
omni.subscribeTree(prefix, callback)
omni.subscribeGlobal(callback)
```

## Alerts/coercers

```ts
omni.alert(path, callback, options?)
omni.coercer(path, callback, options?)
```

## Batch/history

```ts
omni.batch(() => { ... })
omni.undo(path)
omni.timeline.list()
```

## Utilities

```ts
omni.has(path)
omni.exists(path)
omni.isType(path, typeOrTypes)
omni.isPlainObject(path)
omni.toggle(path)
omni.increment(path, amount?)
omni.decrement(path, amount?)
omni.waitFor(pathOrPaths)
omni.explain(path)
omni.export()
omni.clear()
```
