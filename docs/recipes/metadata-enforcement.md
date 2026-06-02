# Recipe: metadata enforcement

Metadata is where Omni's governed mode shines.

## Define metadata schema

```ts
const NodeMetaSchema = {
  type: "object",
  children: {
    width: { type: "number", min: 1, max: 5000, coerce: true },
    height: { type: "number", min: 1, max: 5000, coerce: true },
    label: { type: "string", maxLength: 120, coerce: true },
    locked: { type: "boolean", coerce: true },
  },
} satisfies OmniSchema;

omni.schema("entities.*.meta", NodeMetaSchema);
```

## Create entity metadata

```ts
const result = omni.setObj(defaultMeta, `entities.${id}.meta`, {
  privateSet: true,
  owner: `AmberEntity:${id}`,
  deletePolicy: "owner",
});

const setMeta = result.setter!;
```

## Entity methods

```ts
function setWidth(width: unknown) {
  return setMeta("width", width);
}

function setLabel(label: unknown) {
  return setMeta("label", label);
}
```

## Bypass rejected

```ts
omni.set(`entities.${id}.meta.width`, "garbage"); // rejected by privacy first
```

## Owner invalid write rejected

```ts
setMeta("width", "garbage"); // passes privacy but fails schema
```

## Why this matters

This removes the loophole where MetaProps validate one path while raw Omni writes bypass guarantees.

The entity owns the private setter. Omni owns the enforcement.
