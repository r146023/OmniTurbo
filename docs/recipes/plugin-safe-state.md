# Recipe: plugin-safe state

Plugins should have clear state boundaries.

## Plugin settings root

```ts
const root = `plugins.${pluginId}.settings`;

omni.schema(`plugins.*.settings.enabled`, {
  type: "boolean",
  coerce: true,
});

const result = omni.setObj(defaultSettings, root, {
  privateSet: true,
  owner: `Plugin:${pluginId}`,
});
```

## Expose narrow API

```ts
function setPluginSetting(key: string, value: unknown) {
  return result.setter!(key, value);
}
```

## Do not expose Omni directly

Risky:

```ts
plugin.init({ omni });
```

Better:

```ts
plugin.init({
  getSetting(key) {
    return omni.get(`${root}.${key}`);
  },
  setSetting: setPluginSetting,
});
```

## Plugin scratch state

Plugins can still have loose scratch state:

```ts
omni.set(`plugins.${pluginId}.scratch.lastRun`, Date.now());
```

Govern persistent settings. Leave throwaway scratch loose.
