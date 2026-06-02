import { Omni } from "../../src";
import { assert, assertDeepEquals, assertEquals, test } from "../_harness";

test("Omni direct subscribers fire on set", () => {
  const omni = new Omni();
  const calls: unknown[][] = [];
  omni.subscribe("x", (...args: unknown[]) => calls.push(args));
  omni.set("x", 1);
  assertEquals(calls.length, 1);
  assertDeepEquals(calls[0], ["x", 1, undefined]);
});

test("Omni unsubscribe stops direct subscriber", () => {
  const omni = new Omni();
  let calls = 0;
  const off = omni.subscribe("x", () => calls++);
  omni.set("x", 1);
  off();
  omni.set("x", 2);
  assertEquals(calls, 1);
});

test("Omni tree subscribers fire for descendant changes", () => {
  const omni = new Omni();
  const calls: unknown[][] = [];
  omni.subscribeTree("root", (...args: unknown[]) => calls.push(args));
  omni.set("root.child.value", 1);
  assertEquals(calls.length, 1);
  assertDeepEquals(calls[0], ["root", "root.child.value", 1, undefined]);
});

test("Omni global subscribers fire for all changes", () => {
  const omni = new Omni();
  const paths: string[] = [];
  omni.subscribeGlobal((path) => paths.push(path));
  omni.set("a", 1);
  omni.set("b", 2);
  assertDeepEquals(paths, ["a", "b"]);
});

test("Omni once global subscribers remove after first change", () => {
  const omni = new Omni();
  let calls = 0;
  omni.subscribeGlobal(() => calls++, { once: true });
  omni.set("a", 1);
  omni.set("b", 2);
  assertEquals(calls, 1);
});

test("Omni parent direct subscriber receives rebuilt parent when child changes", () => {
  const omni = new Omni();
  let parentValue: unknown;
  omni.subscribe("root", (_path: string, value: unknown) => parentValue = value);
  omni.set("root.child", 1);
  assertDeepEquals(parentValue, { child: 1 });
});

test("Omni can disable parent notifications semantically", () => {
  const omni = new Omni();
  let calls = 0;
  omni.subscribe("root", () => calls++);
  omni.setParentNotifications(false);
  omni.set("root.child", 1);
  assertEquals(calls, 0);
});

test("Omni alerts fire after valid commits", () => {
  const omni = new Omni();
  const values: unknown[] = [];
  omni.alert("x", (value: unknown) => values.push(value));
  omni.set("x", 1);
  omni.set("x", 2);
  assertDeepEquals(values, [1, 2]);
});

test("Omni alert conditions are respected", () => {
  const omni = new Omni();
  const values: unknown[] = [];
  omni.alert("x", (value: unknown) => values.push(value), { condition: (value: unknown) => Number(value) > 5 });
  omni.set("x", 1);
  omni.set("x", 10);
  assertDeepEquals(values, [10]);
});

test("Omni once alerts remove after first trigger", () => {
  const omni = new Omni();
  let calls = 0;
  omni.alert("x", () => calls++, { once: true });
  omni.set("x", 1);
  omni.set("x", 2);
  assertEquals(calls, 1);
});

test("Omni coercers can transform values before schema validation", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number" });
  omni.coercer("x", (_path, value) => value === "ten" ? 10 : value);
  const result = omni.set("x", "ten");
  assert(result.success);
  assertEquals(omni.get("x"), 10);
});

test("Omni once coercers remove after first trigger", () => {
  const omni = new Omni();
  omni.coercer("x", (_path, value) => Number(value) + 1, { once: true });
  omni.set("x", 1);
  omni.set("x", 1);
  assertEquals(omni.get("x"), 1);
});

test("Omni silent option suppresses notifications, alerts, and coercers", () => {
  const omni = new Omni();
  let subCalls = 0;
  let alertCalls = 0;
  omni.subscribe("x", () => subCalls++);
  omni.alert("x", () => alertCalls++);
  omni.coercer("x", () => 999);
  omni.set("x", 1, { silent: true });
  assertEquals(omni.get("x"), 1);
  assertEquals(subCalls, 0);
  assertEquals(alertCalls, 0);
});
