# Replacing MetaProps enforcement

MetaProps do not necessarily need to disappear. Their role changes.

## Old role

```txt
MetaProp owns value rules
MetaProp validates/coerces
Omni stores final value
```

Problem: raw Omni writes bypass MetaProp.

## New role

```txt
Omni owns enforcement
MetaProp owns ergonomics/UI metadata/intent wrappers
```

A MetaProp can become a descriptor:

```ts
type MetaPropDefinition = {
  key: string;
  label: string;
  schema: OmniSchema;
  ui?: {
    input: "number" | "text" | "switch" | "color";
    group?: string;
  };
};
```

Then register with Omni:

```ts
for (const prop of NodeMetaProps) {
  omni.schema(`entities.*.meta.${prop.key}`, prop.schema);
}
```

## MetaProp as setter wrapper

```ts
class MetaProp<T = unknown> {
  constructor(
    private setter: OmniPrivateSetter,
    private key: string
  ) {}

  set(value: T) {
    return this.setter(this.key, value);
  }
}
```

## Benefits

- one enforcement layer,
- fewer bypass loopholes,
- better debug result objects,
- easier plugin validation,
- less duplicated datatype logic.

## What MetaProps can still do well

- provide UI labels,
- provide grouping/order,
- expose domain-specific setter names,
- define schema fragments,
- map schema to form controls,
- document metadata.
