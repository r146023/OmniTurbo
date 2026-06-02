import { Omni } from "../../src";
import { assertEquals, assertThrows, test } from "../_harness";

test("Omni toggle toggles booleans and undefined", () => {
  const omni = new Omni();
  assertEquals(omni.toggle("flag"), true);
  assertEquals(omni.toggle("flag"), false);
});

test("Omni toggle rejects objects", () => {
  const omni = new Omni();
  omni.set("obj", { x: 1 });
  assertThrows(() => omni.toggle("obj"));
});

test("Omni increment initializes missing path", () => {
  const omni = new Omni();
  assertEquals(omni.increment("count"), 1);
  assertEquals(omni.get("count"), 1);
});

test("Omni increment and decrement update numbers", () => {
  const omni = new Omni();
  omni.set("count", 10);
  assertEquals(omni.increment("count", 5), 15);
  assertEquals(omni.decrement("count", 3), 12);
});

test("Omni increment rejects non-numbers", () => {
  const omni = new Omni();
  omni.set("count", "one");
  assertThrows(() => omni.increment("count"));
});

test("Omni pushToArray appends values", () => {
  const omni = new Omni();
  omni.set("items", [1, 2]);
  const result = omni.set("items", [3, 4], { pushToArray: true });
  assertEquals(result.success, true);
  assertEquals((omni.get("items") as unknown[]).length, 4);
});

test("Omni pushToArray rejects non-array current values", () => {
  const omni = new Omni();
  omni.set("items", "not array");
  const result = omni.set("items", [1], { pushToArray: true });
  assertEquals(result.success, false);
  assertEquals(result.issues[0].code, "OMNI_PUSH_NON_ARRAY");
});
