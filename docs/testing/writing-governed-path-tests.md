# Writing governed path tests

Governed path tests should verify the whole contract.

## Basic schema test

```ts
test("width coerces numeric strings", () => {
  const omni = new Omni();
  omni.schema("width", { type: "number", coerce: true });

  const result = omni.set("width", "250");

  expect(result.success).toBe(true);
  expect(result.value).toBe(250);
  expect(omni.get("width")).toBe(250);
});
```

## Rejection test

```ts
test("invalid width does not overwrite old width", () => {
  const omni = new Omni();
  omni.schema("width", { type: "number" });
  omni.set("width", 100);

  const result = omni.set("width", "bad");

  expect(result.success).toBe(false);
  expect(omni.get("width")).toBe(100);
});
```

## Side-effect test

```ts
test("invalid write does not notify", () => {
  const omni = new Omni();
  omni.schema("width", { type: "number" });
  let calls = 0;
  omni.subscribe("width", () => calls++);

  omni.set("width", "bad");

  expect(calls).toBe(0);
});
```

## Privacy bypass test

```ts
test("private metadata blocks normal writes", () => {
  const omni = new Omni();
  const result = omni.setObj({ width: 100 }, "node.meta", { privateSet: true });

  expect(omni.set("node.meta.width", 200).success).toBe(false);
  expect(result.setter!("width", 200).success).toBe(true);
});
```

## Batch test

```ts
test("batch validates but suppresses startup subscriptions", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number" });
  let calls = 0;
  omni.subscribe("x", () => calls++);

  const result = omni.batch(() => {
    omni.set("x", "1");
    omni.set("x", "bad");
  });

  expect(result.success).toBe(false);
  expect(calls).toBe(0);
  expect(omni.get("x")).toBe(1);
});
```
