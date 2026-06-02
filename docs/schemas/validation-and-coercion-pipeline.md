# Validation and coercion pipeline

The pipeline is the heart of governed paths.

## Order

```txt
incoming value
  -> privacy check
  -> external coercers
  -> datatype coercion
  -> schema coercion
  -> datatype validation
  -> schema validation
  -> commit
  -> side effects
```

## Datatype coercion

```ts
omni.schema("x", { type: "number", coerce: true });

omni.set("x", "12");
omni.get("x"); // 12
```

## Schema coercion

```ts
omni.schema("label", {
  type: "string",
  coerce(value) {
    return String(value).trim();
  },
});
```

## External coercers

```ts
omni.coercer("label", (_path, value) => {
  return typeof value === "string" ? value.trim() : value;
});
```

External coercers are path-level behavior. Schema/datatype coercion is governance behavior.

## Validation failure

```ts
omni.schema("x", { type: "number" });

const result = omni.set("x", "bad");

console.log(result.success); // false
console.log(result.issues);  // details
```

## No side effects on failed validation

```ts
let calls = 0;
omni.subscribe("x", () => calls++);

omni.schema("x", { type: "number" });
omni.set("x", "bad");

console.log(calls); // 0
```

## Disabling validation/coercion per write

```ts
omni.set("x", value, { validate: false });
omni.set("x", value, { coerce: false });
```

Use sparingly. If a path is governed, bypassing governance should be rare and explicit.
