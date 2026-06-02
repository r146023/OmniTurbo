# Delete policies

Private paths need delete rules.

```ts
omni.set("secure.value", 1, {
  privateSet: true,
  deletePolicy: "owner",
});
```

## Policies

### `anyone`

Any caller can delete the path.

```ts
omni.set("x", 1, { privateSet: true, deletePolicy: "anyone" });
omni.delete("x"); // accepted
```

Useful for temporary private values where mutation is protected but cleanup is open.

### `owner`

Only the token holder can delete the path.

```ts
const result = omni.set("x", 1, {
  privateSet: true,
  deletePolicy: "owner",
});

omni.delete("x"); // rejected
omni.delete("x", { token: result.setter!.token }); // accepted
```

Best default for Amber metadata.

### `never`

No one can delete the path through normal delete.

```ts
omni.set("system.version", "1.0.0", {
  privateSet: true,
  deletePolicy: "never",
});
```

Use sparingly.

## Recommendation for Amber

For entity metadata:

```ts
{
  privateSet: true,
  owner: `AmberEntity:${id}`,
  deletePolicy: "owner"
}
```

This prevents random systems from destroying the structural metadata tree.
