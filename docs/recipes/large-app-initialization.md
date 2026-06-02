# Recipe: large app initialization

Use batch to load initial state.

```ts
omni.batch(() => {
  omni.setObj(defaultSettings, "settings");
  omni.setObj(defaultViewport, "viewport");
  omni.setObj(defaultPanels, "ui.panels");
});
```

## With schemas first

Define schemas before loading state.

```ts
registerSchemas(omni);

const result = omni.batch(() => {
  omni.setObj(loadSettings(), "settings");
  omni.setObj(loadWorkspace(), "workspace");
});

if (!result.success) {
  console.table(result.issues);
}
```

## Why batch by default

If 5,000 settings load and each fires subscriptions, startup becomes noisy and harder to reason about.

Batch commits all values first. Then the app can render from the settled state.

## Boot flag pattern

```ts
omni.batch(() => {
  omni.setObj(settings, "settings");
  omni.setObj(workspace, "workspace");
});

omni.set("app.ready", true);
```

Subscribers can listen to `app.ready` instead of every individual initialization write.
