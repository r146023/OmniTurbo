import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Omni set result includes useful fields", () => {
  const omni = new Omni();
  const result = omni.set("x", 1);
  assert(result.success);
  assertEquals(result.action, "set");
  assertEquals(result.path, "x");
  assertEquals(result.originalValue, 1);
  assertEquals(result.value, 1);
  assertEquals(result.changed, true);
});

test("Omni failed set result includes issues and rejected true", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number" });
  const result = omni.set("x", "bad");
  assert(!result.success);
  assert(result.rejected);
  assert(result.issues.length > 0);
});

test("Omni getSchema resolves aliases and wildcards", () => {
  const omni = new Omni();
  omni.aliases.set("node", "entities.node1");
  omni.schema("entities.*.width", { type: "number" });
  assertEquals(omni.getSchema("@node.width")?.type, "number");
});

test("Omni explain includes value, schema, privacy, and timeline", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number" });
  omni.set("x", 1, { privateSet: true, owner: "test" });
  const explanation = omni.explain("x");
  assertEquals(explanation.path, "x");
  assertEquals(explanation.exactValue, 1);
  assert(explanation.schema);
  assert(explanation.privacy);
  assert(Array.isArray(explanation.timeline));
});

test("Omni export includes main registries", () => {
  const omni = new Omni();
  omni.aliases.set("node", "entities.node1");
  omni.schema("x", { type: "number" });
  omni.set("x", 1, { privateSet: true });
  const exported = omni.export();
  assert(exported.store);
  assert(exported.schemas);
  assert(exported.privacy);
  assert(exported.aliases);
  assert(exported.timeline);
});
