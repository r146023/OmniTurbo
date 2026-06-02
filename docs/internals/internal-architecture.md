# Internal architecture

Omni is composed from registries and small utility modules.

## Main class

`Omni.ts` orchestrates:

- path resolution,
- set/get/delete,
- schema validation,
- privacy checks,
- subscriptions,
- history,
- timeline,
- batch.

## Store

The internal store is a map:

```ts
Map<string, OmniValueObject>
```

Each value object may contain:

- current value,
- previous value,
- history,
- timestamps,
- value classification flags.

## Registry pattern

Separate registries keep Omni from becoming a single-file monster again.

```ts
DataTypeRegistry
SchemaRegistry
PrivacyRegistry
AliasRegistry
SubscriptionRegistry
Timeline
```

## Write orchestration

`_setInternal()` is the important private method.

It should remain the single normal commit path.

Do not add alternate global write modes that change semantics.

## Caching

`getObj()` can cache rebuilt object trees. Any set/delete under a parent path should invalidate affected caches.

## Future candidates

- transactions,
- computed paths,
- persistent storage,
- wildcard subscribers,
- TTL/expiration,
- max store size/eviction,
- devtools inspector.
