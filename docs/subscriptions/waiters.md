# Waiters

Waiters return promises that resolve when paths become available.

```ts
await omni.waitFor("app.ready");
```

## Multiple paths

```ts
const values = await omni.waitFor([
  "settings.loaded",
  "plugins.loaded",
]);
```

Result:

```ts
{
  "settings.loaded": true,
  "plugins.loaded": true
}
```

## Excluded values

By default, waiters exclude `undefined` and `null`.

```ts
await omni.waitFor("x", [undefined, null, false]);
```

## Good uses

- waiting for app boot flags,
- waiting for plugin registration,
- waiting for async settings load,
- waiting for a selected entity id.

## Bad uses

Do not use waiters as a replacement for subscriptions in UI rendering. Waiters resolve once; subscriptions stay reactive.
