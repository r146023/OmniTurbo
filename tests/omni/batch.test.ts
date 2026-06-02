import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Omni function batch commits queued values", () => {
  const omni = new Omni();
  const result = omni.batch(() => {
    omni.set("a", 1);
    omni.set("b", 2);
  });
  assert(result.success);
  assertEquals(omni.get("a"), 1);
  assertEquals(omni.get("b"), 2);
});

test("Omni function batch suppresses direct subscriptions by default", () => {
  const omni = new Omni();
  let calls = 0;
  omni.subscribe("a", () => calls++);
  omni.batch(() => omni.set("a", 1));
  assertEquals(calls, 0);
});

test("Omni function batch can notify when requested", () => {
  const omni = new Omni();
  let calls = 0;
  omni.subscribe("a", () => calls++);
  omni.batch(() => omni.set("a", 1), undefined, { notify: true });
  assertEquals(calls, 1);
});

test("Omni object batch commits flattened values", () => {
  const omni = new Omni();
  const result = omni.batch({ user: { name: "Ada" }, count: 1 });
  assert(result.success);
  assertEquals(omni.get("user.name"), "Ada");
  assertEquals(omni.get("count"), 1);
});

test("Omni object batch supports prefix", () => {
  const omni = new Omni();
  omni.batch({ name: "Ada" }, "user");
  assertEquals(omni.get("user.name"), "Ada");
});

test("Omni batch applies schema validation", () => {
  const omni = new Omni();
  omni.schema("a", { type: "number" });
  const result = omni.batch(() => {
    omni.set("a", "1");
    omni.set("a", "bad");
  });
  assert(!result.success);
  assertEquals(omni.get("a"), 1);
});

test("Omni batch can suppress timeline", () => {
  const omni = new Omni();
  omni.batch(() => omni.set("a", 1), undefined, { suppressTimeline: true });
  assertEquals(omni.timeline.list().length, 0);
});

test("Omni immediate set bypasses queue inside batch", () => {
  const omni = new Omni();
  let calls = 0;
  omni.subscribe("a", () => calls++);
  omni.batch(() => {
    omni.set("a", 1, { immediate: true });
    assertEquals(omni.get("a"), 1);
  });
  assertEquals(calls, 1);
});
