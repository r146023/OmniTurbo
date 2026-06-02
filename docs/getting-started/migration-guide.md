# Migration guide

This guide assumes you are moving from the older single-file OmniTurbo or from the early modular version.

## 1. `set()` no longer returns boolean

Old:

```ts
if (omni.set("x", 1)) {
  console.log("changed");
}
```

New:

```ts
const result = omni.set("x", 1);

if (result.success && result.changed) {
  console.log("changed");
}
```

Why?

Because writes can now:

- be coerced,
- fail validation,
- fail privacy checks,
- return issues,
- return a private setter,
- report old/new values.

A boolean cannot carry that information.

## 2. Efficiency modes are gone

Removed concepts:

- `quickMode`,
- `fastStore`,
- `setQuickMode`,
- nuclear notification paths.

The store now has one semantic path for normal state behavior.

Why?

Mode-dependent behavior made bugs harder to reason about. Omni is infrastructure. Infrastructure should be predictable first.

## 3. Batch remains

Batch was kept because it is not just a speed optimization. It expresses initialization semantics.

```ts
omni.batch(() => {
  omni.set("settings.theme", "dark");
  omni.set("settings.zoom", 1);
});
```

By default, batch commits values but suppresses per-path subscription/alert spam.

## 4. Use schemas for important paths

Old pattern:

```ts
entity.meta.width.set(250); // local enforcement
omni.set(path, value);      // bypass possible
```

New pattern:

```ts
omni.schema("entities.*.meta.width", {
  type: "number",
  min: 1,
  max: 5000,
});

omni.set("entities.node_1.meta.width", 250);
```

The enforcement lives at the source of truth.

## 5. Use private setters for owner-controlled paths

```ts
const result = omni.setObj(defaultMeta, "entities.node_1.meta", {
  privateSet: true,
  owner: "AmberNode:node_1",
});

const setMeta = result.setter!;

omni.set("entities.node_1.meta.width", 300); // rejected
setMeta("width", 300);                       // accepted
```

## 6. `setObj()` is preferred for addressable object trees

Old code may have stored objects atomically:

```ts
omni.set("node.meta", { width: 100, height: 80 });
```

That stores the object at `node.meta`, but child paths are not addressable.

Use:

```ts
omni.setObj({ width: 100, height: 80 }, "node.meta");
```

Now these work:

```ts
omni.get("node.meta.width");
omni.set("node.meta.width", 250);
```

## 7. Update tests

If using Vitest, tests must call Vitest's `test()` function directly or through a harness that re-exports it.

Correct harness shape:

```ts
import { expect, test as vitestTest } from "vitest";

export const test = vitestTest;

export function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  expect(condition, message).toBeTruthy();
}
```

If Vitest reports “No test suite found,” the test files are being loaded but no Vitest tests are being registered.

## 8. Migration checklist

- [ ] Replace boolean `set()` checks with `OmniResult` checks.
- [ ] Remove any calls to `setQuickMode`.
- [ ] Use `batch()` for initialization loads.
- [ ] Define schemas for critical metadata paths.
- [ ] Use `setObj()` for addressable object trees.
- [ ] Use `privateSet` for entity-owned state.
- [ ] Add tests for invalid write rejection.
- [ ] Add tests that invalid writes do not trigger side effects.
- [ ] Add `explain()` calls when debugging path behavior.
