import { expect, test } from "vitest";
import { Omni } from "../../src";

test("protected setters keep a truthful result and isolate a throwing direct subscriber", () => {
  const omni = new Omni();
  const first = "protected.alpha.title";
  const second = "protected.beta.title";
  expect(omni.schema(first, { type: "string", maxLength: 32 }).success).toBe(true);
  expect(omni.schema(second, { type: "string", maxLength: 32 }).success).toBe(true);
  const madeA = omni.set(first, "before", { privateSet: true, owner: "a", history: false });
  const madeB = omni.set(second, "B", { privateSet: true, owner: "b", history: false });
  expect(madeA.success && madeB.success).toBe(true);
  expect(madeA.setter && madeB.setter).toBeDefined();

  const delivered: unknown[][] = [];
  const sensitive = "secret-runtime-detail-not-for-results";
  omni.subscribe(first, () => { throw new Error(sensitive); });
  omni.subscribe(first, (...args: unknown[]) => {
    delivered.push([...args, omni.get(first)]);
  });

  const committed = madeA.setter!("after");
  expect(committed).toMatchObject({
    success: true,
    rejected: false,
    changed: true,
    path: first,
    value: "after",
    oldValue: "before",
  });
  expect(omni.get(first)).toBe("after");
  expect(omni.get(second)).toBe("B");
  expect(delivered).toEqual([[first, "after", "before", "after"]]);
  expect(committed.issues).toEqual([
    expect.objectContaining({
      code: "OMNI_SUBSCRIBER_CALLBACK_FAILED",
      severity: "warning",
      source: "subscription",
      path: first,
    }),
  ]);
  expect(JSON.stringify(committed.issues)).not.toContain(sensitive);
  expect(JSON.stringify(committed.issues)).not.toContain("token");

  // An authorized setter for root A must not grant authority to root B.
  expect(omni.set(second, "STOLEN", { token: madeA.setter!.token }).success).toBe(false);
  expect(omni.set(first, "RAW").success).toBe(false);
  expect(omni.set(second, "RAW").success).toBe(false);
  expect(madeA.setter!("X".repeat(60)).success).toBe(false);
  expect(delivered).toHaveLength(1);
  expect(omni.get(first)).toBe("after");
  expect(omni.get(second)).toBe("B");
});

test("synchronous failures are isolated across direct, global, tree and parent notifications", () => {
  const omni = new Omni();
  const order: string[] = [];
  omni.subscribe("root.child", () => { order.push("direct-bad"); throw new Error("secret-direct"); });
  omni.subscribe("root.child", () => { order.push("direct-good"); });
  omni.subscribeGlobal(() => { order.push("global-bad"); throw new Error("secret-global"); });
  omni.subscribeGlobal(() => { order.push("global-good"); });
  omni.subscribeTree("root", (_parent: string, changed: string, value: unknown) => {
    expect([changed, value]).toEqual(["root.child", "value"]);
    order.push("tree-bad");
    throw new Error("secret-tree");
  });
  omni.subscribeTree("root", () => { order.push("tree-good"); });
  omni.subscribe("root", (_path: string, parent: unknown) => {
    expect(parent).toEqual({ child: "value" });
    order.push("parent-bad");
    throw new Error("secret-parent");
  });
  omni.subscribe("root", () => { order.push("parent-good"); });

  const result = omni.set("root.child", "value");
  expect(result.success).toBe(true);
  expect(result.issues).toHaveLength(4);
  expect(result.issues.every((issue) => issue.code === "OMNI_SUBSCRIBER_CALLBACK_FAILED")).toBe(true);
  expect(result.issues.map((issue) => issue.details?.kind)).toEqual(["direct", "global", "tree", "parent"]);
  expect(order).toEqual([
    "direct-bad", "direct-good", "global-bad", "global-good",
    "tree-bad", "tree-good", "parent-bad", "parent-good",
  ]);
  for (const secret of ["secret-direct", "secret-global", "secret-tree", "secret-parent"]) {
    expect(JSON.stringify(result.issues)).not.toContain(secret);
  }
});

test("parent notification opt-out and unsubscribe behavior remain intact", () => {
  const omni = new Omni();
  omni.setParentNotifications(false);
  const calls: string[] = [];
  omni.subscribe("root", () => { calls.push("parent"); throw new Error("not expected"); });
  const off = omni.subscribe("root.child", () => { calls.push("direct"); });
  omni.subscribeTree("root", () => { calls.push("tree"); });
  expect(omni.set("root.child", 1).issues).toEqual([]);
  off();
  expect(omni.set("root.child", 2).issues).toEqual([]);
  expect(calls).toEqual(["direct", "tree", "tree"]);
});

test("a throwing once subscriber is consumed and a throttled failed attempt counts", () => {
  const omni = new Omni();
  let onceCalls = 0;
  let throttleCalls = 0;
  const seen: number[] = [];
  omni.subscribeGlobal(() => { onceCalls++; throw new Error("once failed"); }, { once: true });
  omni.subscribeGlobal(() => { throttleCalls++; throw new Error("throttled failed"); }, { throttle: 60_000 });
  omni.subscribe("value", (_path: string, value: number) => { seen.push(value); });
  const first = omni.set("value", 1);
  const second = omni.set("value", 2);
  expect(first.success && second.success).toBe(true);
  expect(first.issues).toHaveLength(2);
  expect(second.issues).toEqual([]);
  expect([onceCalls, throttleCalls]).toEqual([1, 1]);
  expect(seen).toEqual([1, 2]);
});

test("undo returns successful result and warning without stopping later observers", () => {
  const omni = new Omni();
  expect(omni.set("undo.target", "original").success).toBe(true);
  expect(omni.set("undo.target", "next").success).toBe(true);
  let delivered = 0;
  omni.subscribe("undo.target", () => { throw new Error("undo observer failed"); });
  omni.subscribe("undo.target", () => { delivered++; });
  const result = omni.undo("undo.target");
  expect(result).toMatchObject({ success: true, rejected: false, changed: true, value: "original" });
  expect(result.issues).toEqual([
    expect.objectContaining({ code: "OMNI_SUBSCRIBER_CALLBACK_FAILED", source: "subscription" }),
  ]);
  expect(delivered).toBe(1);
  expect(omni.get("undo.target")).toBe("original");
});

test("notified batches preserve committed child results and continue after observer errors", () => {
  const omni = new Omni();
  const delivered: string[] = [];
  omni.subscribe("batch.a", () => { throw new Error("batch observer"); });
  omni.subscribe("batch.a", () => { delivered.push("a"); });
  omni.subscribe("batch.b", () => { delivered.push("b"); });
  const result = omni.batch(() => {
    omni.set("batch.a", 1);
    omni.set("batch.b", 2);
  }, undefined, { notify: true, alerts: false, waiters: false });
  expect(result.success).toBe(true);
  expect(result.children?.map((child) => child.success)).toEqual([true, true]);
  expect(result.children?.[0]?.issues).toEqual([
    expect.objectContaining({ code: "OMNI_SUBSCRIBER_CALLBACK_FAILED" }),
  ]);
  expect(result.issues).toHaveLength(1);
  expect(delivered).toEqual(["a", "b"]);
  expect(omni.get("batch.a")).toBe(1);
  expect(omni.get("batch.b")).toBe(2);
});

test("pre-commit coercers still reject by throwing without committing or notifying", () => {
  const omni = new Omni();
  const seen: unknown[] = [];
  omni.subscribe("validate.value", (_path: string, value: unknown) => seen.push(value));
  omni.coercer("validate.value", () => { throw new Error("precommit rejection"); });
  expect(() => omni.set("validate.value", 3)).toThrow("precommit rejection");
  expect(omni.get("validate.value")).toBeUndefined();
  expect(seen).toEqual([]);
});

test("documented number-to-string coercion remains supported", () => {
  const omni = new Omni();
  expect(omni.schema("labels.number", { type: "string" }).success).toBe(true);
  const result = omni.set("labels.number", 42);
  expect(result.success).toBe(true);
  expect(result.value).toBe("42");
  expect(omni.get("labels.number")).toBe("42");
});
