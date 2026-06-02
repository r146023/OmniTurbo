# Side-effect lifecycle

Omni writes have two phases:

1. pre-commit checks/transforms,
2. post-commit side effects.

## Intended lifecycle

```txt
incoming value
  -> alias resolution
  -> privacy check
  -> external coercers
  -> datatype coercion
  -> schema coercion
  -> datatype validation
  -> schema validation
  -> commit to store
  -> history/timeline
  -> subscriptions
  -> alerts
  -> waiters
  -> OmniResult
```

## Important guarantee

If validation or privacy fails, the value should not commit.

Therefore, the following should not happen:

- direct subscribers should not fire,
- tree subscribers should not fire,
- alerts should not fire,
- waiters should not resolve,
- invalid state should not be visible through `get()`.

## Example

```ts
omni.schema("node.width", { type: "number", min: 1 });

omni.subscribe("node.width", () => {
  console.log("committed width changed");
});

omni.set("node.width", 100);      // subscriber fires
omni.set("node.width", "banana"); // rejected, subscriber should not fire
```

## Silent updates

```ts
omni.set("x", 1, { silent: true });
```

A silent update suppresses:

- subscriptions,
- alerts,
- waiters,
- external coercers.

Use carefully. Silent writes can make dependent UI state stale if you use them casually.

## Batch initialization

Batch suppresses per-path side effects by default because it is meant for startup state loading.

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
});
```

This is not an efficiency mode. It is an initialization semantic.
