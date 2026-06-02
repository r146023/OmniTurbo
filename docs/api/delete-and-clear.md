# Delete and clear

## `delete(path, options?)`

Deletes a path and child paths.

```ts
omni.setObj({ child: { value: 1 } }, "root");

omni.delete("root");

omni.get("root.child.value"); // undefined
```

Returns `OmniResult`.

```ts
const result = omni.delete("root");
console.log(result.success);
console.log(result.changed);
```

## Privacy-aware delete

Private paths may require an owner token depending on delete policy.

```ts
const result = omni.set("secure.value", 1, {
  privateSet: true,
  deletePolicy: "owner",
});

omni.delete("secure.value"); // rejected
omni.delete("secure.value", { token: result.setter!.token }); // accepted
```

## Delete policies

```ts
"anyone" // any caller can delete
"owner"  // only token holder can delete
"never"  // cannot delete, even with owner token
```

## `clear()`

Clears store values and timeline.

```ts
omni.clear();
```

Use carefully. It is a full reset.

## Recommended pattern

Avoid broad deletes in plugin code. Prefer deleting owned path roots:

```ts
omni.delete(`plugins.${pluginId}`);
```

Do not let plugin code delete global roots unless deliberately allowed.
