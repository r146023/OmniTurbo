# Installation

OmniTurbo is currently structured as a local TypeScript package. The exact publish target can be adjusted later, but the source is already laid out like a normal package.

## Local repository install

From the OmniTurbo project root:

```bash
npm install
npm run typecheck
npm test
```

Then import from the package entrypoint:

```ts
import { Omni } from "./src";

const omni = new Omni();
```

After publishing:

```bash
npm install omniturbo
```

```ts
import { Omni } from "omniturbo";
```

## TypeScript setup

A typical `tsconfig.json` should work:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

If you are using Vite, the `Bundler` resolution mode is usually the smoothest option.

## Test setup

The test package uses Vitest:

```bash
npm test
```

The package script should look like:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^3.2.6"
  }
}
```

## Recommended repo layout

```txt
omniturbo/
  docs/
  src/
  tests/
  package.json
  tsconfig.json
```

## Integration into Amber

For Amber, install or copy the package into the codebase, then create a single app-level Omni instance:

```ts
// src/state/omni.ts
import { Omni } from "omniturbo";

export const omni = new Omni();
```

Avoid creating many unrelated Omni instances unless you have a deliberate reason. Most Amber systems should share one state graph so schemas, privacy, subscriptions, and debugging tools can see the whole picture.
