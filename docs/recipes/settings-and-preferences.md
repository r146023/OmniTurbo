# Recipe: settings and preferences

Settings are a perfect fit for schemas.

```ts
omni.schema("settings.theme", {
  type: "string",
  enum: ["light", "dark", "system"],
});

omni.schema("settings.zoom", {
  type: "number",
  min: 0.5,
  max: 3,
  coerce: true,
});

omni.schema("settings.grid.enabled", {
  type: "boolean",
  coerce: true,
});
```

## Load settings

```ts
const storedSettings = JSON.parse(localStorage.getItem("settings") ?? "{}");

const result = omni.batch(() => {
  omni.setObj(storedSettings, "settings");
});

if (!result.success) {
  console.warn("Some settings were invalid", result.issues);
}
```

## Save settings

```ts
omni.subscribeTree("settings", () => {
  localStorage.setItem("settings", JSON.stringify(omni.getObj("settings")));
});
```

For real apps, debounce this.

## Defaults

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
  omni.set("settings.grid.enabled", true);
});
```
