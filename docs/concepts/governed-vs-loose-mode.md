# Governed vs loose mode

Omni has two personalities.

## Loose mode

Loose mode is the default.

```ts
omni.set("scratch.random", anything);
```

There are no schemas, no type rules, and no privacy rules.

Use loose mode for:

- temporary UI state,
- experimental plugin state,
- caches,
- logs,
- internal scratch values.

## Governed mode

A path is governed when it has schema/privacy/datatype rules.

```ts
omni.schema("settings.zoom", {
  type: "number",
  min: 0.1,
  max: 4,
});
```

Now writes are checked before commit.

```ts
omni.set("settings.zoom", 1.5);     // valid
omni.set("settings.zoom", "oops"); // rejected
```

## Mixed usage is expected

You do not need to govern the entire store.

```txt
settings.theme                         governed
settings.zoom                          governed
viewport.pan.x                         loose or governed
entities.*.meta.width                  governed
RAM.consoleLogs.logs                   loose
plugins.experimentalPlugin.scratch     loose
```

This is intentional.

## Govern critical boundaries

Govern anything that crosses a trust boundary:

- plugin input,
- user input,
- entity metadata,
- saved settings,
- command arguments,
- generated values from AI/code tools,
- values that trigger expensive side effects.

## Do not over-govern noise

Not every temporary flag needs a schema.

```ts
omni.set("ui.hoveredElementId", id);
omni.set("debug.lastClick", eventInfo);
```

Schemas are valuable when invalid state would cost you time, create bugs, or break architectural guarantees.
