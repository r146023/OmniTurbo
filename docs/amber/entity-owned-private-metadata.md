# Entity-owned private metadata

This is the recommended Amber pattern.

## Entity class

```ts
class AmberNode {
  private readonly metaPath: string;
  private readonly setMeta: OmniPrivateSetter;

  constructor(public readonly id: string) {
    this.metaPath = `entities.${id}.meta`;

    const result = omni.setObj(this.defaultMeta(), this.metaPath, {
      privateSet: true,
      owner: `AmberNode:${id}`,
      deletePolicy: "owner",
    });

    if (!result.success || !result.setter) {
      throw new Error(`Failed to create metadata for node ${id}`);
    }

    this.setMeta = result.setter;
  }

  private defaultMeta() {
    return {
      width: 100,
      height: 80,
      x: 0,
      y: 0,
      rotate: 0,
      locked: false,
      hidden: false,
      label: "",
    };
  }

  setPosition(x: unknown, y: unknown) {
    const rx = this.setMeta("x", x);
    const ry = this.setMeta("y", y);
    return [rx, ry];
  }

  setSize(width: unknown, height: unknown) {
    const rw = this.setMeta("width", width);
    const rh = this.setMeta("height", height);
    return [rw, rh];
  }
}
```

## Command integration

Commands should call entity methods:

```ts
command("resizeNode", ({ node, width, height }) => {
  const [rw, rh] = node.setSize(width, height);
  if (!rw.success || !rh.success) {
    return { success: false, issues: [...rw.issues, ...rh.issues] };
  }
  return { success: true };
});
```

## Plugin integration

Plugins should receive controlled capabilities.

```ts
pluginApi.updateNodeLabel = (nodeId, label) => {
  const node = nodeManager.get(nodeId);
  return node.setLabel(label);
};
```

Do not hand random plugin code direct private setters unless the plugin truly owns that state.
