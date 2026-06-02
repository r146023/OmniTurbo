# Built-in datatypes

Omni registers built-in datatypes on construction.

```ts
const omni = new Omni();
```

## `any`

Accepts anything.

```ts
omni.schema("scratch", { type: "any" });
```

## `unknown`

Accepts anything. Useful for explicitly documenting unknown external values.

```ts
omni.schema("plugin.payload", { type: "unknown" });
```

## `string`

Validates strings. Can coerce non-null values with `String(value)`.

```ts
omni.schema("label", { type: "string", coerce: true });
```

## `number`

Validates finite numbers. Can coerce numeric strings.

```ts
omni.schema("width", { type: "number", coerce: true });
```

## `integer`

Validates integer numbers. Can coerce integer-like strings.

```ts
omni.schema("count", { type: "integer", min: 0 });
```

## `boolean`

Validates booleans. Can coerce common boolean-like values.

```ts
omni.schema("enabled", { type: "boolean", coerce: true });
```

Common accepted coercions may include:

```txt
"true"  -> true
"1"     -> true
"yes"   -> true
"on"    -> true
"false" -> false
"0"     -> false
"no"    -> false
"off"   -> false
0       -> false
1       -> true
```

## `object`

Validates plain objects.

```ts
omni.schema("node.meta", { type: "object" });
```

## `array`

Validates arrays.

```ts
omni.schema("selection.ids", { type: "array" });
```

## `null`

Validates `null`.

## `undefined`

Validates `undefined`.

## Choosing datatypes

Use the narrowest useful datatype.

```ts
// Better
{ type: "integer", min: 0 }

// Weaker
{ type: "number" }

// Weakest
{ type: "any" }
```
