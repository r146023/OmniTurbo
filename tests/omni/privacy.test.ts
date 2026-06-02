import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Omni privateSet returns setter and blocks normal root writes", () => {
  const omni = new Omni();
  const result = omni.set("entity.node1.meta.locked", false, { privateSet: true, owner: "node1" });
  assert(result.success);
  assert(result.setter);
  assert(!omni.set("entity.node1.meta.locked", true).success);
  assertEquals(omni.get("entity.node1.meta.locked"), false);
  assert(result.setter!(true).success);
  assertEquals(omni.get("entity.node1.meta.locked"), true);
});

test("Omni privateSet setter can update children", () => {
  const omni = new Omni();
  const result = omni.set("root", {}, { privateSet: true, owner: "owner" });
  assert(result.setter);
  assert(result.setter!("child.value", 123).success);
  assertEquals(omni.get("root.child.value"), 123);
  assert(!omni.set("root.child.value", 456).success);
});

test("Omni setObj privateSet protects root tree", () => {
  const omni = new Omni();
  const result = omni.setObj({ meta: { width: 100, height: 50 } }, "entity.node1", { privateSet: true, owner: "node1" });
  assert(result.success);
  assert(result.setter);
  assert(!omni.set("entity.node1.meta.width", 200).success);
  assert(result.setter!("meta.width", 200).success);
  assertEquals(omni.get("entity.node1.meta.width"), 200);
});

test("Omni private delete owner policy blocks normal delete", () => {
  const omni = new Omni();
  const result = omni.set("x", 1, { privateSet: true, deletePolicy: "owner" });
  assert(result.setter);
  const denied = omni.delete("x");
  assert(!denied.success);
  assertEquals(omni.get("x"), 1);
  const allowed = omni.delete("x", { token: result.setter!.token });
  assert(allowed.success);
  assertEquals(omni.get("x"), undefined);
});

test("Omni private delete anyone policy allows normal delete", () => {
  const omni = new Omni();
  omni.set("x", 1, { privateSet: true, deletePolicy: "anyone" });
  const result = omni.delete("x");
  assert(result.success);
});

test("Omni private delete never policy blocks owner too", () => {
  const omni = new Omni();
  const result = omni.set("x", 1, { privateSet: true, deletePolicy: "never" });
  assert(result.setter);
  const denied = omni.delete("x", { token: result.setter!.token });
  assert(!denied.success);
  assertEquals(omni.get("x"), 1);
});

test("Omni canSet respects privacy checks", () => {
  const omni = new Omni();
  const result = omni.set("x", 1, { privateSet: true });
  assert(!omni.canSet("x", 2).success);
  assert(result.setter!(2).success);
  assertEquals(omni.get("x"), 2);
});
