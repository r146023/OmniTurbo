# Write tokens and private setters

Privacy is implemented with capability-style write tokens.

## Write token

Conceptually:

```ts
type OmniWriteToken = {
  id: string;
  rootPath: string;
  owner?: string;
  canWriteChildren: boolean;
  created: number;
};
```

Whoever has the token can write the protected path.

Most code should not pass tokens manually. Use the private setter.

## Private setter

```ts
const result = omni.set("secure.value", 1, {
  privateSet: true,
});

const setSecure = result.setter!;
```

Write root value:

```ts
setSecure(2);
```

For private trees, write child values:

```ts
const meta = omni.setObj({ width: 100 }, "node.meta", {
  privateSet: true,
});

meta.setter!("width", 250);
meta.setter!("style.fill", "#ff0000");
```

## Do not leak setters broadly

Treat private setters like authority.

Good:

```ts
class AmberNode {
  private setMeta: OmniPrivateSetter;

  constructor() {
    this.setMeta = omni.setObj(defaultMeta, this.metaPath, {
      privateSet: true,
      owner: this.id,
    }).setter!;
  }

  setWidth(width: unknown) {
    return this.setMeta("width", width);
  }
}
```

Risky:

```ts
pluginApi.setMeta = node.setMeta; // plugin can now mutate all private metadata
```

Prefer exposing specific methods.

## Manual token usage

Advanced code can pass a token directly:

```ts
omni.set("secure.value", 2, {
  token: result.setter!.token,
});
```

Use this for infrastructure-level operations, not normal app code.
