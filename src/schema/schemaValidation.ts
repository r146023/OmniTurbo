import type { DataTypeRegistry } from "../datatypes/DataTypeRegistry";
import { OMNI_REJECT, NO_COERCE } from "../types/datatype_types";
import type { OmniIssue } from "../types/issue_types";
import type { OmniSchema } from "../types/schema_types";

export interface ValidationPipelineInput {
  path: string;
  value: unknown;
  oldValue?: unknown;
  schema?: OmniSchema;
  dataTypes: DataTypeRegistry;
  coerce?: boolean;
  validate?: boolean;
}

export interface ValidationPipelineResult {
  success: boolean;
  value: unknown;
  issues: OmniIssue[];
  schema?: OmniSchema;
}

function issue(path: string, code: string, message: string, expected: unknown, received: unknown, source: OmniIssue["source"] = "schema"): OmniIssue {
  return { code, severity: "error", path, message, expected, received, source };
}

function validatorIssues(path: string, output: boolean | string | OmniIssue | OmniIssue[]): OmniIssue[] {
  if (output === true) return [];
  if (output === false) return [issue(path, "OMNI_SCHEMA_VALIDATION_FAILED", "Schema validator returned false.", "valid value", undefined)];
  if (typeof output === "string") return [issue(path, "OMNI_SCHEMA_VALIDATION_FAILED", output, "valid value", undefined)];
  return Array.isArray(output) ? output : [output];
}

export function runSchemaValidation(input: ValidationPipelineInput): ValidationPipelineResult {
  const { path, oldValue, schema, dataTypes } = input;
  const issues: OmniIssue[] = [];
  let value = input.value;
  const shouldCoerce = input.coerce !== false;
  const shouldValidate = input.validate !== false;

  if (!schema) return { success: true, value, issues };

  if (value === undefined && schema.required) {
    issues.push(issue(path, "OMNI_REQUIRED", "Path is required.", "defined value", value));
  }
  if (value === null && schema.nullable === false) {
    issues.push(issue(path, "OMNI_NOT_NULLABLE", "Path does not allow null.", "non-null value", value));
  }

  if (shouldCoerce) {
    const dataType = dataTypes.get(schema.type);
    if (dataType?.coerce) {
      const coerced = dataType.coerce(value, { path, oldValue });
      if (coerced === OMNI_REJECT) issues.push(issue(path, "OMNI_COERCE_REJECTED", `Datatype '${schema.type}' could not coerce value.`, schema.type, value, "datatype"));
      else if (coerced !== NO_COERCE) value = coerced;
    }

    if (typeof schema.coerce === "function") {
      const coerced = schema.coerce(value, { path, oldValue });
      if (coerced === OMNI_REJECT) issues.push(issue(path, "OMNI_SCHEMA_COERCE_REJECTED", "Schema coercer rejected value.", "coercible value", value, "coercion"));
      else if (coerced !== NO_COERCE) value = coerced;
    }
  }

  if (shouldValidate) {
    const dataType = dataTypes.get(schema.type);
    if (schema.type && dataType?.validate) {
      issues.push(...validatorIssues(path, dataType.validate(value, { path, originalValue: input.value, oldValue })).map((i) => ({ ...i, source: i.source ?? "datatype" })));
    } else if (schema.type && !dataTypes.has(schema.type)) {
      issues.push(issue(path, "OMNI_UNKNOWN_DATATYPE", `Unknown datatype '${schema.type}'.`, "registered datatype", schema.type, "datatype"));
    }

    if (typeof value === "number") {
      if (typeof schema.min === "number" && value < schema.min) issues.push(issue(path, "OMNI_MIN", `Value must be >= ${schema.min}.`, schema.min, value));
      if (typeof schema.max === "number" && value > schema.max) issues.push(issue(path, "OMNI_MAX", `Value must be <= ${schema.max}.`, schema.max, value));
    }

    if (typeof value === "string" || Array.isArray(value)) {
      if (typeof schema.minLength === "number" && value.length < schema.minLength) issues.push(issue(path, "OMNI_MIN_LENGTH", `Value length must be >= ${schema.minLength}.`, schema.minLength, value.length));
      if (typeof schema.maxLength === "number" && value.length > schema.maxLength) issues.push(issue(path, "OMNI_MAX_LENGTH", `Value length must be <= ${schema.maxLength}.`, schema.maxLength, value.length));
    }

    if (schema.enum && !schema.enum.some((allowed) => Object.is(allowed, value))) {
      issues.push(issue(path, "OMNI_ENUM", "Value is not in allowed enum.", schema.enum, value));
    }

    if (schema.pattern && typeof value === "string") {
      const re = typeof schema.pattern === "string" ? new RegExp(schema.pattern) : schema.pattern;
      if (!re.test(value)) issues.push(issue(path, "OMNI_PATTERN", "Value does not match required pattern.", re.toString(), value));
    }

    const validators = Array.isArray(schema.validate) ? schema.validate : schema.validate ? [schema.validate] : [];
    for (const validator of validators) {
      issues.push(...validatorIssues(path, validator(value, { path, originalValue: input.value, oldValue })));
    }
  }

  return { success: issues.filter((i) => i.severity === "error").length === 0, value, issues, schema };
}
