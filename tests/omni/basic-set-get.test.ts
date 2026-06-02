import { Omni } from "../../src";
import { assert, assertDeepEquals, assertEquals, test } from "../_harness";

test("Omni sets and gets primitive values", () => {
  const omni = new Omni();
  const result = omni.set("user.name", "Colemen");
  assert(result.success);
  assert(result.changed);
  assertEquals(omni.get("user.name"), "Colemen");
});

test("Omni returns changed false when setting equal value", () => {
  const omni = new Omni();
  omni.set("x", 1);
  const result = omni.set("x", 1);
  assert(result.success);
  assertEquals(result.changed, false);
});

test("Omni set asObject delegates to object storage", () => {
  const omni = new Omni();
  const result = omni.set("user", { name: "Ada", age: 36 }, { asObject: true });
  assert(result.success);
  assertEquals(omni.get("user.name"), "Ada");
  assertEquals(omni.get("user.age"), 36);
});

test("Omni set asObject rejects non-objects", () => {
  const omni = new Omni();
  const result = omni.set("user", 123, { asObject: true });
  assert(!result.success);
  assertEquals(result.issues[0].code, "OMNI_AS_OBJECT_EXPECTS_OBJECT");
});

test("Omni setObj flattens nested objects and preserves arrays", () => {
  const omni = new Omni();
  const result = omni.setObj({ user: { name: "Ada" }, items: [1, 2] });
  assert(result.success);
  assertEquals(omni.get("user.name"), "Ada");
  assertDeepEquals(omni.get("items"), [1, 2]);
});

test("Omni setObj with prefix stores under prefix", () => {
  const omni = new Omni();
  omni.setObj({ name: "Ada", meta: { width: 200 } }, "entity.node1");
  assertEquals(omni.get("entity.node1.name"), "Ada");
  assertEquals(omni.get("entity.node1.meta.width"), 200);
});

test("Omni getObj rebuilds object subtree", () => {
  const omni = new Omni();
  omni.set("user.name.first", "Ada");
  omni.set("user.name.last", "Lovelace");
  assertDeepEquals(omni.getObj("user"), { name: { first: "Ada", last: "Lovelace" } });
});

test("Omni get clone shallow protects top-level references", () => {
  const omni = new Omni();
  const obj = { a: { b: 1 } };
  omni.set("obj", obj);
  const clone = omni.get("obj", { clone: "shallow" }) as typeof obj;
  assert(clone !== obj);
  assert(clone.a === obj.a);
});

test("Omni get clone deep protects nested references", () => {
  const omni = new Omni();
  const obj = { a: { b: 1 } };
  omni.set("obj", obj);
  const clone = omni.get("obj", { clone: "deep" }) as typeof obj;
  assert(clone !== obj);
  assert(clone.a !== obj.a);
});

test("Omni getMany returns path-value map", () => {
  const omni = new Omni();
  omni.set("a", 1);
  omni.set("b", 2);
  assertDeepEquals(omni.getMany(["a", "b", "c"]), { a: 1, b: 2 });
});

test("Omni has, exists, isType, and isPlainObject report current state", () => {
  const omni = new Omni();
  omni.set("obj", { x: 1 });
  omni.set("arr", [1]);
  omni.set("n", 1);
  assert(omni.has("obj"));
  assert(omni.exists("obj"));
  assert(omni.isPlainObject("obj"));
  assert(omni.isType("arr", "array"));
  assert(omni.isType("n", ["number", "string"]));
  assert(!omni.isType("missing", "undefined"));
});

test("Omni overwriting an object path atomically clears children", () => {
  const omni = new Omni();
  omni.setObj({ child: { value: 1 } }, "root");
  assertEquals(omni.get("root.child.value"), 1);
  omni.set("root", "atomic");
  assertEquals(omni.get("root"), "atomic");
  assertEquals(omni.get("root.child.value"), undefined);
});
