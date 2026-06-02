import { Omni } from "../../src";
import { OMNI_REJECT } from "../../src/types/datatype_types";
import { assert, assertEquals, test } from "../_harness";

test("Omni schema coerces valid values before commit", () => {
  const omni = new Omni();
  omni.schema("entity.*.meta.width", { type: "number", min: 1, max: 5000, coerce: true });
  const result = omni.set("entity.node1.meta.width", "250");
  assert(result.success);
  assertEquals(result.value, 250);
  assertEquals(omni.get("entity.node1.meta.width"), 250);
});

test("Omni schema rejects invalid values and preserves old value", () => {
  const omni = new Omni();
  omni.schema("entity.*.meta.width", { type: "number", min: 1, max: 5000, coerce: true });
  omni.set("entity.node1.meta.width", "250");
  const result = omni.set("entity.node1.meta.width", "banana");
  assert(!result.success);
  assertEquals(omni.get("entity.node1.meta.width"), 250);
});

test("Omni unknown datatype rejects governed writes", () => {
  const omni = new Omni();
  omni.schema("x", { type: "missingDatatype" });
  const result = omni.set("x", 1);
  assert(!result.success);
  assert(result.issues.some((issue) => issue.code === "OMNI_UNKNOWN_DATATYPE"));
});

test("Omni can register custom datatypes", () => {
  const omni = new Omni();
  omni.dataTypes.register({
    name: "evenNumber",
    coerce: (value) => {
      const n = Number(value);
      return Number.isFinite(n) ? n : OMNI_REJECT;
    },
    validate: (value) => typeof value === "number" && value % 2 === 0 || "Value must be even.",
  });
  omni.schema("x", { type: "evenNumber" });
  assert(omni.set("x", "4").success);
  assertEquals(omni.get("x"), 4);
  const rejected = omni.set("x", "5");
  assert(!rejected.success);
  assertEquals(omni.get("x"), 4);
});

test("Omni schema onInvalid keepOld commits no change and reports success", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number", onInvalid: "keepOld" });
  omni.set("x", 10);
  const result = omni.set("x", "bad");
  assert(result.success);
  assertEquals(result.changed, false);
  assertEquals(omni.get("x"), 10);
});

test("Omni schema onInvalid setDefault stores default after invalid input", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number", default: 7, onInvalid: "setDefault" });
  const result = omni.set("x", "bad");
  assert(result.success);
  assertEquals(omni.get("x"), 7);
});

test("Omni readonly schema rejects second write", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number", readonly: true });
  assert(omni.set("x", 1).success);
  const result = omni.set("x", 2);
  assert(!result.success);
  assertEquals(result.issues[0].code, "OMNI_READONLY");
  assertEquals(omni.get("x"), 1);
});

test("Omni writeOnce schema rejects second write", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number", writeOnce: true });
  assert(omni.set("x", 1).success);
  const result = omni.set("x", 2);
  assert(!result.success);
  assertEquals(result.issues[0].code, "OMNI_WRITE_ONCE");
});

test("Omni parent children schema governs child path", () => {
  const omni = new Omni();
  omni.schema("entities.*.meta", { type: "object", children: { width: { type: "number", max: 100 } } });
  assert(omni.set("entities.node1.meta.width", "50").success);
  const rejected = omni.set("entities.node1.meta.width", "150");
  assert(!rejected.success);
  assertEquals(omni.get("entities.node1.meta.width"), 50);
});

test("Omni array item schema governs numeric child paths", () => {
  const omni = new Omni();
  omni.schema("items", { type: "array", items: { type: "integer", min: 0 } });
  assert(omni.set("items.0", "5").success);
  assertEquals(omni.get("items.0"), 5);
  assert(!omni.set("items.1", "5.5").success);
});

test("Omni canSet validates without committing", () => {
  const omni = new Omni();
  omni.schema("x", { type: "number" });
  const result = omni.canSet("x", "10");
  assert(result.success);
  assertEquals(result.value, 10);
  assertEquals(omni.get("x"), undefined);
});
