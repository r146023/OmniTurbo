import { builtInDataTypes } from "../../src/datatypes/builtins";
import { DataTypeRegistry } from "../../src/datatypes/DataTypeRegistry";
import { OMNI_REJECT } from "../../src/types/datatype_types";
import { assert, assertEquals, assertThrows, test } from "../_harness";

test("DataTypeRegistry registers and retrieves custom datatypes", () => {
  const registry = new DataTypeRegistry();
  registry.register({ name: "positive", validate: (v) => typeof v === "number" && v > 0 });
  assert(registry.has("positive"));
  assertEquals(registry.get("positive")?.name, "positive");
});

test("DataTypeRegistry rejects nameless definitions", () => {
  const registry = new DataTypeRegistry();
  assertThrows(() => registry.register({ name: "" as any }));
});

test("built-in string datatype coerces non-null values", () => {
  const stringType = builtInDataTypes.find((type) => type.name === "string")!;
  assertEquals(stringType.coerce!(123, { path: "x" }), "123");
  assertEquals(stringType.coerce!(null, { path: "x" }), OMNI_REJECT);
});

test("built-in number datatype coerces numeric strings and rejects invalid strings", () => {
  const numberType = builtInDataTypes.find((type) => type.name === "number")!;
  assertEquals(numberType.coerce!("12.5", { path: "x" }), 12.5);
  assertEquals(numberType.coerce!("banana", { path: "x" }), OMNI_REJECT);
});

test("built-in integer datatype rejects floats", () => {
  const integerType = builtInDataTypes.find((type) => type.name === "integer")!;
  assertEquals(integerType.coerce!("12", { path: "x" }), 12);
  assertEquals(integerType.coerce!("12.5", { path: "x" }), OMNI_REJECT);
});

test("built-in boolean datatype accepts common boolean-like values", () => {
  const booleanType = builtInDataTypes.find((type) => type.name === "boolean")!;
  assertEquals(booleanType.coerce!("yes", { path: "x" }), true);
  assertEquals(booleanType.coerce!("off", { path: "x" }), false);
  assertEquals(booleanType.coerce!(0, { path: "x" }), false);
});
