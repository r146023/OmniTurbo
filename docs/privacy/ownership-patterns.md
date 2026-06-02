# Ownership patterns

## Entity-owned metadata

```ts
class AmberEntity {
  private readonly metaPath: string;
  private readonly setMeta: OmniPrivateSetter;

  constructor(private id: string) {
    this.metaPath = `entities.${id}.meta`;

    const result = omni.setObj(defaultMeta, this.metaPath, {
      privateSet: true,
      owner: `AmberEntity:${id}`,
      deletePolicy: "owner",
    });

    this.setMeta = result.setter!;
  }

  setWidth(width: unknown) {
    return this.setMeta("width", width);
  }
}
```

## Manager-owned state

```ts
const result = omni.setObj(initialSelectionState, "selection", {
  privateSet: true,
  owner: "SelectionManager",
});

export const setSelectionState = result.setter!;
```

Only the manager should receive the setter.

## Plugin-owned state

```ts
const result = omni.setObj(pluginDefaults, `plugins.${pluginId}.settings`, {
  privateSet: true,
  owner: `Plugin:${pluginId}`,
});
```

Expose narrow plugin APIs:

```ts
function setPluginSetting(key: string, value: unknown) {
  return result.setter!(key, value);
}
```

## Shared state

If many systems legitimately need to write a path, do not make it private. Govern it with schema instead.

```ts
omni.schema("viewport.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
});
```

## Rule of thumb

Use schema for value correctness.

Use privacy for write authority.

Use both for critical state.
