# Installation

OmniTurbo is published as the scoped ESM package `@r146023/omniturbo` and supports maintained Node.js releases beginning with Node 22.

## Install from npm

```bash
npm install @r146023/omniturbo
```

Then import from the package entrypoint:

```ts
import { Omni } from "@r146023/omniturbo";

const omni = new Omni();
```

The package is native ESM. Downstream applications may use NodeNext/Node16 or bundler-oriented TypeScript resolution as appropriate for their own runtime; OmniTurbo's emitted package is verified directly under native Node ESM and does not require a bundler to repair its imports.

## Install an exact GitHub Release artifact

Each release created by the repository release workflow includes an installable `npm pack` `.tgz` artifact plus `SHA256SUMS`.

A consumer that needs to pin a reviewed release artifact may install that exact `.tgz` rather than relying on GitHub's automatic source archive. The source zip/tarball is not the packaged library because generated `dist/` output is intentionally not committed.

## Local repository development

From the OmniTurbo project root:

```bash
npm ci
npm run verify
```

`npm run verify` runs the repository release contract:

- strict TypeScript checking under NodeNext resolution;
- the full Vitest suite;
- production build;
- `npm pack` into a temporary artifact;
- fresh installation of that artifact into a temporary consumer;
- native Node ESM import plus `Omni` set/get smoke;
- package payload dry run.

`npm audit --audit-level=high` is also required by CI and the release workflow.

## TypeScript setup

OmniTurbo itself is built with `module` and `moduleResolution` set to `NodeNext` so invalid relative ESM specifiers fail at compile time.

Consumers do not need to copy OmniTurbo's exact compiler configuration. For a native Node ESM application, a representative configuration is:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "skipLibCheck": true
  }
}
```

Vite and other bundler-based applications may use `moduleResolution: "Bundler"` if that fits the application. Package correctness does not depend on it.

## Release process

Repository releases are tag-driven and re-run the complete verification contract before producing the installable artifact. See [`../releasing.md`](../releasing.md) for the governed release procedure.

## Application integration

Most applications should deliberately choose the lifetime and ownership of their Omni instance rather than creating unrelated stores accidentally:

```ts
// src/state/omni.ts
import { Omni } from "@r146023/omniturbo";

export const omni = new Omni();
```

A shared application-level instance is useful when schemas, privacy, subscriptions, and debugging tools are intended to observe one state graph. Multiple instances remain valid when architectural isolation is deliberate.
