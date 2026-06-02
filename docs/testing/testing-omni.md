# Testing Omni

Omni should be tested as infrastructure.

That means testing not only happy paths, but also invariants:

- invalid writes do not commit,
- invalid writes do not trigger side effects,
- privacy cannot be bypassed,
- schemas resolve predictably,
- object trees rebuild correctly,
- batch does not spam subscriptions,
- result objects contain enough debugging data.

## Run tests

```bash
npm test
```

## Type check

```bash
npm run typecheck
```

## Vitest harness

If using a shared harness, make sure it re-exports Vitest's `test`.

```ts
import { expect, test as vitestTest } from "vitest";

export const test = vitestTest;

export function assert(condition: unknown, message = "Assertion failed"): asserts condition {
  expect(condition, message).toBeTruthy();
}
```

If Vitest says “No test suite found,” your files were loaded but did not register Vitest tests.

## Recommended test categories

```txt
tests/
  core/
  datatypes/
  schema/
  privacy/
  aliases/
  result/
  omni/
  integration/
  regression/
```

## Regression tests

Keep regression tests for architectural decisions:

```ts
test("Omni no longer exposes quick mode", () => {
  const omni = new Omni() as any;
  expect(omni.setQuickMode).toBeUndefined();
});
```

## Integration tests

Test Amber-like workflows:

```ts
test("entity metadata is private and schema governed", () => {
  const meta = omni.setObj(defaultMeta, path, { privateSet: true });
  expect(omni.set(`${path}.width`, 200).success).toBe(false);
  expect(meta.setter!("width", 200).success).toBe(true);
});
```
