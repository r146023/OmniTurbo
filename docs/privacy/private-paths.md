# Private paths

Private paths prevent normal `set()` calls from mutating owner-controlled state.

```ts
const result = omni.set("entity.node_1.meta.locked", false, {
  privateSet: true,
  owner: "AmberNode:node_1",
});

omni.set("entity.node_1.meta.locked", true); // rejected
result.setter!(true);                        // accepted
```

## Why privacy exists

Without privacy, any actor can bypass an entity's setter/validation layer:

```ts
entity.setWidth(250); // carefully designed
omni.set("entities.node_1.meta.width", "garbage"); // bypass
```

Privacy moves write enforcement into Omni, the source of truth.

## Private trees

For object roots, privacy applies to children.

```ts
const result = omni.setObj(
  { width: 100, height: 80 },
  "entities.node_1.meta",
  { privateSet: true, owner: "AmberNode:node_1" }
);

omni.set("entities.node_1.meta.width", 200); // rejected
result.setter!("width", 200);                // accepted
```

## Private paths still support side effects

Privacy only restricts writes.

These still work:

```ts
omni.subscribe("entities.node_1.meta.width", callback);
omni.alert("entities.node_1.meta.width", callback);
omni.get("entities.node_1.meta.width");
omni.explain("entities.node_1.meta.width");
```

## Schema-level privacy

Schemas can request privacy:

```ts
omni.schema("secure.value", {
  type: "number",
  privateSet: true,
});
```

First write creates the private rule and returns a setter.

```ts
const result = omni.set("secure.value", 1);
const setter = result.setter!;
```

## Owner labels

`owner` is for debugging and diagnostics.

```ts
omni.set("x", 1, {
  privateSet: true,
  owner: "AmberNode:node_1",
});
```

Actual enforcement is token-based, not name-based.
