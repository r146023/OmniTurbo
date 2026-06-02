import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Omni no longer exposes global quick/efficiency mode toggles", () => {
  const omni = new Omni() as any;
  assertEquals(typeof omni.setQuickMode, "undefined");
});

test("Omni has one consistent set/get semantic path", () => {
  const omni = new Omni();
  omni.set("a.b", 1);
  assertEquals(omni.get("a.b"), 1);
  omni.set("a", "atomic");
  assertEquals(omni.get("a"), "atomic");
  assertEquals(omni.get("a.b"), undefined);
});
