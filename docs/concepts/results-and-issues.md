# Results and issues

Every significant operation should return structured information.

## OmniResult

```ts
type OmniResult<T = unknown> = {
  success: boolean;
  action: OmniAction;
  path: string;
  originalValue?: unknown;
  value?: T;
  oldValue?: unknown;
  changed?: boolean;
  rejected?: boolean;
  issues: OmniIssue[];
  options?: Record<string, unknown>;
  schema?: OmniSchema;
  setter?: OmniPrivateSetter;
  children?: OmniResult[];
};
```

## Successful write

```ts
const result = omni.set("settings.zoom", "2", {
  schema: { type: "number" },
});
```

Possible result:

```ts
{
  success: true,
  action: "set",
  path: "settings.zoom",
  originalValue: "2",
  value: 2,
  oldValue: undefined,
  changed: true,
  rejected: false,
  issues: []
}
```

## Failed write

```ts
const result = omni.set("settings.zoom", "banana");
```

Possible result:

```ts
{
  success: false,
  action: "set",
  path: "settings.zoom",
  originalValue: "banana",
  value: "banana",
  oldValue: 2,
  changed: false,
  rejected: true,
  issues: [
    {
      code: "OMNI_COERCE_REJECTED",
      severity: "error",
      path: "settings.zoom",
      message: "Datatype 'number' could not coerce value.",
      source: "datatype"
    }
  ]
}
```

## OmniIssue

```ts
type OmniIssue = {
  code: string;
  severity: "debug" | "info" | "warning" | "error";
  path: string;
  message: string;
  source:
    | "schema"
    | "datatype"
    | "privacy"
    | "coercion"
    | "subscription"
    | "history"
    | "batch"
    | "alias"
    | "internal";
  expected?: unknown;
  received?: unknown;
  details?: Record<string, unknown>;
};
```

## Why result objects matter

Boolean returns hide the most important information.

Bad:

```ts
if (!omni.set("x", value)) {
  console.log("failed or unchanged or private or invalid?");
}
```

Good:

```ts
const result = omni.set("x", value);

if (!result.success) {
  console.table(result.issues);
}
```

## Child results

Batch and `setObj()` may return child results.

```ts
const result = omni.setObj({
  width: 100,
  height: "bad",
}, "node.meta");

for (const child of result.children ?? []) {
  console.log(child.path, child.success, child.issues);
}
```

This makes partial failures inspectable.

## Result handling pattern

```ts
function mustSet(result: OmniResult): void {
  if (!result.success) {
    const message = result.issues.map(i => `${i.code}: ${i.message}`).join("\n");
    throw new Error(message);
  }
}

mustSet(omni.set("settings.zoom", 1.25));
```
