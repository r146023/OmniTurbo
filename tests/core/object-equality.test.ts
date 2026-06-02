import { buildObjectFromEntries, fastClone, flattenObjectSimple, isPlainObjectValue, isPrimitive } from "../../src/core/object";
import { fastEquals } from "../../src/core/equality";
import { assert, assertDeepEquals, assertEquals, test } from "../_harness";

test("isPrimitive distinguishes objects and primitive-ish values", () => {
  assert(isPrimitive(null));
  assert(isPrimitive(undefined));
  assert(isPrimitive("x"));
  assert(!isPrimitive({}));
  assert(!isPrimitive([]));
});

test("isPlainObjectValue rejects arrays and null", () => {
  assert(isPlainObjectValue({ a: 1 }));
  assert(!isPlainObjectValue([]));
  assert(!isPlainObjectValue(null));
});

test("flattenObjectSimple flattens objects but preserves arrays", () => {
  const flat = flattenObjectSimple({ user: { name: "A" }, items: [1, 2] });
  assertDeepEquals(flat, { "user.name": "A", items: [1, 2] });
});

test("flattenObjectSimple avoids circular recursion", () => {
  const obj: Record<string, unknown> = { a: 1 };
  obj.self = obj;
  const flat = flattenObjectSimple(obj);
  assertEquals(flat.a, 1);
});

test("buildObjectFromEntries rebuilds a subtree", () => {
  const obj = buildObjectFromEntries([
    ["user.name.first", "Ada"],
    ["user.name.last", "Lovelace"],
    ["settings.theme", "dark"],
  ], "user");
  assertDeepEquals(obj, { name: { first: "Ada", last: "Lovelace" } });
});

test("fastClone shallow clone protects top-level object", () => {
  const source = { a: { b: 1 }, c: 2 };
  const clone = fastClone(source, "shallow");
  assert(clone !== source);
  assert(clone.a === source.a);
});

test("fastClone deep clone protects nested object", () => {
  const source = { a: { b: 1 }, c: 2 };
  const clone = fastClone(source, "deep");
  assert(clone !== source);
  assert(clone.a !== source.a);
  assertDeepEquals(clone, source);
});

test("fastEquals handles primitives, arrays, objects, and dates", () => {
  assert(fastEquals(1, 1));
  assert(!fastEquals(1, "1"));
  assert(fastEquals([1, { x: 2 }], [1, { x: 2 }]));
  assert(fastEquals({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } }));
  assert(fastEquals(new Date("2020-01-01"), new Date("2020-01-01")));
});
