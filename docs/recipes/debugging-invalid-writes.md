# Recipe: debugging invalid writes

## Start with the result

```ts
const result = omni.set(path, value);

if (!result.success) {
  console.table(result.issues);
}
```

## Inspect the path

```ts
console.log(omni.explain(path));
```

Look for:

- resolved schema,
- privacy rule,
- old value,
- timeline entries.

## Common failures

### Unknown datatype

```txt
OMNI_UNKNOWN_DATATYPE
```

Fix: register the datatype or correct the schema name.

### Coercion rejected

```txt
OMNI_COERCE_REJECTED
```

Fix: inspect input value and datatype coercer behavior.

### Private path

```txt
OMNI_PRIVATE_PATH
```

Fix: use the private setter or pass the owner token.

### Min/max failure

```txt
OMNI_MIN
OMNI_MAX
```

Fix: clamp before set or show a validation error.

## Debug helper

```ts
function logOmniFailure(result: OmniResult) {
  if (result.success) return;

  console.group(`Omni write failed: ${result.path}`);
  console.log("original", result.originalValue);
  console.log("old", result.oldValue);
  console.table(result.issues);
  console.groupEnd();
}
```
