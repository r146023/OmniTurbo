# Alerts

Alerts are post-commit reactions with optional conditions/throttling/once behavior.

```ts
const remove = omni.alert("settings.zoom", (value, oldValue, path) => {
  console.log("zoom changed", value);
});
```

## Conditional alerts

```ts
omni.alert("settings.zoom", (value) => {
  console.warn("zoom is very high", value);
}, {
  condition: (value) => Number(value) > 3,
});
```

## Once alerts

```ts
omni.alert("app.ready", () => {
  console.log("ready once");
}, { once: true });
```

## Throttled alerts

```ts
omni.alert("mouse.position", callback, {
  throttle: 100,
});
```

## Alerts only fire after valid commits

If schema validation fails, alerts should not fire.

```ts
omni.schema("width", { type: "number" });
omni.alert("width", () => console.log("valid width committed"));

omni.set("width", "bad"); // no alert
```

## Alerts vs subscriptions

Use subscriptions for normal state synchronization.

Use alerts for notable events or guardrail notifications.
