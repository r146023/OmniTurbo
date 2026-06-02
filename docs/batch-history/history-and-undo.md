# History and undo

Omni can track per-path history.

```ts
omni.set("x", 1);
omni.set("x", 2);
omni.undo("x");

omni.get("x"); // 1
```

## Disable history per write

```ts
omni.set("x", 1, { history: false });
```

## Schema history settings

```ts
omni.schema("x", {
  type: "number",
  history: true,
  historyLimit: 20,
});
```

## History limit

```ts
omni.schema("x", {
  type: "number",
  historyLimit: 5,
});
```

Only recent values are retained.

## Undo result

```ts
const result = omni.undo("x");

if (!result.success) {
  console.log(result.issues);
}
```

## Important distinction

History is per path. It is not the same as global timeline.

- History supports undo-like behavior.
- Timeline supports inspection/debugging.

## Future redo

If redo is added, it should preserve the same result semantics and validation expectations.
