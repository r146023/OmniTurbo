import { DataTypeRegistry } from "../../src/datatypes/DataTypeRegistry";
import { builtInDataTypes } from "../../src/datatypes/builtins";
import { SchemaRegistry } from "../../src/schema/SchemaRegistry";
import { resolveDefault } from "../../src/schema/schemaDefaults";
import { runSchemaValidation } from "../../src/schema/schemaValidation";
import { OMNI_REJECT } from "../../src/types/datatype_types";
import { assert, assertDeepEquals, assertEquals, test } from "../_harness";

const dataTypes = new DataTypeRegistry();
dataTypes.registerMany(builtInDataTypes);

test("SchemaRegistry resolves exact schemas", () => {
  const registry = new SchemaRegistry();
  registry.define("settings.zoom", { type: "number" });
  assertEquals(registry.resolve("settings.zoom")?.schema.type, "number");
});

test("SchemaRegistry resolves wildcard schemas", () => {
  const registry = new SchemaRegistry();
  registry.define("entities.*.meta.width", { type: "number" });
  assertEquals(registry.resolve("entities.node1.meta.width")?.pattern, "entities.*.meta.width");
});

test("SchemaRegistry prefers more specific schemas", () => {
  const registry = new SchemaRegistry();
  registry.define("entities.*.meta.width", { type: "number", max: 5000 });
  registry.define("entities.special.meta.width", { type: "integer", max: 100 });
  assertEquals(registry.resolve("entities.special.meta.width")?.schema.type, "integer");
});

test("SchemaRegistry resolves child schemas from parent children", () => {
  const registry = new SchemaRegistry();
  registry.define("entities.*.meta", {
    type: "object",
    children: {
      width: { type: "number" },
      label: { type: "string" },
    },
  });
  assertEquals(registry.resolve("entities.node1.meta.width")?.schema.type, "number");
});

test("SchemaRegistry resolves array item schema for numeric index paths", () => {
  const registry = new SchemaRegistry();
  registry.define("items", { type: "array", items: { type: "string" } });
  assertEquals(registry.resolve("items.0")?.schema.type, "string");
});

test("resolveDefault supports literal and function defaults", () => {
  assertEquals(resolveDefault({ default: 5 }), 5);
  assertEquals(resolveDefault({ default: () => "fresh" }), "fresh");
});

test("runSchemaValidation coerces and validates numbers", () => {
  const result = runSchemaValidation({ path: "x", value: "42", schema: { type: "number", min: 1, max: 100 }, dataTypes });
  assert(result.success);
  assertEquals(result.value, 42);
});

test("runSchemaValidation rejects failed coercion", () => {
  const result = runSchemaValidation({ path: "x", value: "nope", schema: { type: "number" }, dataTypes });
  assert(!result.success);
  assert(result.issues.some((issue) => issue.code === "OMNI_COERCE_REJECTED"));
});

test("runSchemaValidation enforces enum and pattern", () => {
  const result = runSchemaValidation({ path: "x", value: "blue", schema: { type: "string", enum: ["red", "green"], pattern: "^b" }, dataTypes });
  assert(!result.success);
  assert(result.issues.some((issue) => issue.code === "OMNI_ENUM"));
  assert(!result.issues.some((issue) => issue.code === "OMNI_PATTERN"));
});

test("runSchemaValidation collects custom validator issues", () => {
  const result = runSchemaValidation({
    path: "x",
    value: 3,
    schema: { type: "number", validate: (value) => Number(value) % 2 === 0 || "Must be even." },
    dataTypes,
  });
  assert(!result.success);
  assertEquals(result.issues[0].message, "Must be even.");
});

test("runSchemaValidation honors schema coercer", () => {
  const result = runSchemaValidation({
    path: "x",
    value: "abc",
    schema: { type: "string", coerce: (value) => String(value).toUpperCase() },
    dataTypes,
  });
  assert(result.success);
  assertEquals(result.value, "ABC");
});

test("runSchemaValidation reports schema coercer rejection", () => {
  const result = runSchemaValidation({
    path: "x",
    value: "abc",
    schema: { type: "string", coerce: () => OMNI_REJECT },
    dataTypes,
  });
  assert(!result.success);
  assert(result.issues.some((issue) => issue.code === "OMNI_SCHEMA_COERCE_REJECTED"));
});
