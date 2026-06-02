import { Omni } from "../../src";
import { assert, assertEquals, test } from "../_harness";

test("Amber-style metadata is governed by schemas and private setters", () => {
  const omni = new Omni();
  omni.schema("entities.*.meta", {
    type: "object",
    children: {
      width: { type: "number", min: 1, max: 5000 },
      height: { type: "number", min: 1, max: 5000 },
      label: { type: "string", maxLength: 120 },
      locked: { type: "boolean" },
    },
  });

  const meta = omni.setObj({ width: 100, height: 80, label: "Node", locked: false }, "entities.node1.meta", {
    privateSet: true,
    owner: "AmberNode:node1",
  });

  assert(meta.success);
  assert(meta.setter);
  assertEquals(omni.get("entities.node1.meta.width"), 100);

  const bypass = omni.set("entities.node1.meta.width", 200);
  assert(!bypass.success);
  assertEquals(omni.get("entities.node1.meta.width"), 100);

  const validOwnerWrite = meta.setter!("width", "250");
  assert(validOwnerWrite.success);
  assertEquals(omni.get("entities.node1.meta.width"), 250);

  const invalidOwnerWrite = meta.setter!("width", "banana");
  assert(!invalidOwnerWrite.success);
  assertEquals(omni.get("entities.node1.meta.width"), 250);
});

test("Amber-style invalid metadata writes do not trigger side effects", () => {
  const omni = new Omni();
  omni.schema("entities.*.meta.width", { type: "number", min: 1, max: 5000 });
  omni.set("entities.node1.meta.width", 100);
  let subCalls = 0;
  let alertCalls = 0;
  omni.subscribe("entities.node1.meta.width", () => subCalls++);
  omni.alert("entities.node1.meta.width", () => alertCalls++);
  const result = omni.set("entities.node1.meta.width", "banana");
  assert(!result.success);
  assertEquals(subCalls, 0);
  assertEquals(alertCalls, 0);
});

// This test documents the intended final behavior for schema-level privateSet.
// If it fails, either implement schema.privateSet enforcement or keep using set/setObj { privateSet: true } for now.
test("Amber-style schema privateSet should eventually create privacy without repeating options", () => {
  const omni = new Omni();
  omni.schema("secure.value", { type: "number", privateSet: true });
  const result = omni.set("secure.value", 1);
  assert(result.success);
  const bypass = omni.set("secure.value", 2);
  assert(!bypass.success, "schema.privateSet should protect governed paths after creation");
});
