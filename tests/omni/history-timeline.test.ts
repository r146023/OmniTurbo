import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Omni timeline records creates and updates", () => {
  const omni = new Omni();
  omni.set("x", 1);
  omni.set("x", 2);
  const entries = omni.timeline.list();
  assertEquals(entries.length, 2);
  assertEquals(entries[0].action, "created");
  assertEquals(entries[1].action, "updated");
});

test("Omni suppressTimeline prevents timeline recording", () => {
  const omni = new Omni();
  omni.set("x", 1, { suppressTimeline: true });
  assertEquals(omni.timeline.list().length, 0);
});

test("Omni undo restores previous value", () => {
  const omni = new Omni();
  omni.set("x", 1);
  omni.set("x", 2);
  const result = omni.undo("x");
  assert(result.success);
  assertEquals(omni.get("x"), 1);
});

test("Omni undo reports issue when no history exists", () => {
  const omni = new Omni();
  const result = omni.undo("missing");
  assert(!result.success);
  assertEquals(result.issues[0].code, "OMNI_NO_HISTORY");
});

test("Omni history false disables undo history", () => {
  const omni = new Omni();
  omni.set("x", 1, { history: false });
  omni.set("x", 2, { history: false });
  const result = omni.undo("x");
  assert(!result.success);
});

test("Omni schema historyLimit limits undo depth", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number", historyLimit: 1 });
  omni.set("x", 1);
  omni.set("x", 2);
  omni.set("x", 3);
  omni.undo("x");
  assertEquals(omni.get("x"), 2);
  const second = omni.undo("x");
  assert(!second.success);
});

test("Omni delete removes value and children and records deletion", () => {
  const omni = new Omni();
  omni.setObj({ child: { value: 1 } }, "root");
  const result = omni.delete("root");
  assert(result.success);
  assertEquals(omni.get("root.child.value"), undefined);
  assert(omni.timeline.list().some((entry) => entry.action === "deleted"));
});

test("Omni clear removes values and timeline", () => {
  const omni = new Omni();
  omni.set("x", 1);
  omni.clear();
  assertEquals(omni.get("x"), undefined);
  assertEquals(omni.timeline.list().length, 0);
});
