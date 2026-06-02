# Batch initialization

Batch exists mainly for initialization.

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
  omni.set("viewport.pan.x", 0);
  omni.set("viewport.pan.y", 0);
});
```

## Why batch exists

When loading full app state, thousands of values may be set. You usually do not want every subscription/alert to fire while the app is still booting.

Batch lets you commit the state without creating a storm of side effects.

## Default behavior

By default, batch suppresses:

- per-path subscriptions,
- alerts,
- waiters during individual writes.

The values still commit.

## Request notifications

```ts
omni.batch(() => {
  omni.set("x", 1);
}, undefined, {
  notify: true,
  alerts: true,
  waiters: true,
});
```

## Object batch

```ts
omni.batch({
  theme: "dark",
  zoom: 1,
}, "settings");
```

Equivalent paths:

```txt
settings.theme
settings.zoom
```

## Validation still matters

Batch should still validate governed paths.

```ts
omni.schema("settings.zoom", { type: "number" });

const result = omni.batch(() => {
  omni.set("settings.zoom", "1");
  omni.set("settings.zoom", "bad");
});

console.log(result.success); // false if any child write failed
```

## Batch is not transaction

Batch does not necessarily mean rollback.

A failed child write may leave previous valid child writes committed.

Future transaction support could add all-or-nothing behavior.
