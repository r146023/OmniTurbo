# Gotchas

## `set()` returns `OmniResult`, not boolean

```ts
const result = omni.set("x", 1);
if (result.success) {}
```

## Atomic object vs tree object

```ts
omni.set("x", { a: 1 });
omni.get("x.a"); // undefined

omni.setObj({ a: 1 }, "x");
omni.get("x.a"); // 1
```

## Private path reads are allowed

Privacy restricts writes, not reads.

## Invalid writes should not trigger subscriptions

If they do, that is a bug.

## Batch is not rollback

Batch groups/suppresses side effects. It is not necessarily all-or-nothing.

## Schema wildcard matches one segment

```txt
entities.*.meta.width
```

Matches:

```txt
entities.node_1.meta.width
```

Not:

```txt
entities.node_1.deep.meta.width
```

## Vitest “No test suite found”

Your test files are loaded but no Vitest `test()` calls are registered. Make sure a custom harness re-exports Vitest's `test`.

## Do not overuse silent

Silent writes can make UI/subscribers stale.

## Do not leak private setters

A private setter is authority. Expose narrow methods instead.
