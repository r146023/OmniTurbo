# Amber metadata integration

Amber's metadata should become governed Omni state.

## Goal

Instead of:

```txt
MetaProp validates/coerces
Omni stores values loosely
raw Omni writes can bypass MetaProp
```

Use:

```txt
Amber entity owns setter intent
Omni stores values and enforces schemas/privacy
raw Omni writes cannot bypass governed private paths
```

## Register schemas

```ts
export function registerAmberSchemas(omni: Omni) {
  omni.schema("entities.*.meta", {
    type: "object",
    children: {
      width: { type: "number", min: 1, max: 5000, coerce: true },
      height: { type: "number", min: 1, max: 5000, coerce: true },
      x: { type: "number", coerce: true },
      y: { type: "number", coerce: true },
      rotate: { type: "number", coerce: true },
      label: { type: "string", maxLength: 120, coerce: true },
      locked: { type: "boolean", coerce: true },
      hidden: { type: "boolean", coerce: true },
    },
  });
}
```

## Entity creation

```ts
class AmberEntity {
  private readonly setMeta: OmniPrivateSetter;

  constructor(public readonly id: string) {
    const result = omni.setObj(this.defaultMeta(), `entities.${id}.meta`, {
      privateSet: true,
      owner: `AmberEntity:${id}`,
      deletePolicy: "owner",
    });

    if (!result.success || !result.setter) {
      throw new Error("Failed to initialize entity metadata");
    }

    this.setMeta = result.setter;
  }

  setWidth(width: unknown) {
    return this.setMeta("width", width);
  }
}
```

## UI reads stay simple

```ts
const width = omni.get(`entities.${id}.meta.width`);
```

## UI writes should go through entity intent

```ts
entity.setWidth(input.value);
```

Not:

```ts
omni.set(`entities.${id}.meta.width`, input.value);
```

## Subscriber usage

```ts
omni.subscribeTree(`entities.${id}.meta`, () => {
  entity.render();
});
```

This still works with private paths. Privacy restricts writes, not reads/subscriptions.
