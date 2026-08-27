# Releasing OmniTurbo

OmniTurbo releases must prove the packaged artifact, not only the source tree.

## Release contract

A release is valid only when all of the following are true:

1. `npm ci` reconstructs the exact lockfile graph.
2. `npm audit --audit-level=high` passes.
3. `npm run typecheck` passes under Node-valid ESM resolution.
4. `npm test` passes.
5. `npm run build` emits `dist/` successfully.
6. `npm run test:package` packs the library, installs that tarball into a fresh temporary consumer, imports `@r146023/omniturbo` with native Node ESM, constructs `Omni`, and performs a set/get smoke.
7. `npm run pack:check` confirms the publish payload.
8. The Git tag exactly matches `package.json` version as `v<version>`.

`npm run verify` performs the source/build/package checks used by CI and the release workflow.

## GitHub release procedure

1. Merge an already-qualified release change to `main`.
2. Update `package.json` and `package-lock.json` to the intended version in the reviewed release change.
3. Create and push the matching tag, for example `v0.1.2`.
4. `.github/workflows/release.yml` re-runs the full verification contract.
5. The workflow creates (or updates) the GitHub Release and uploads:
   - the installable `npm pack` `.tgz` artifact;
   - `SHA256SUMS` for the release artifact.

A GitHub source zip/tarball is not considered the installable OmniTurbo package. Consumers that need a deterministic release artifact should use the `.tgz` attached to the GitHub Release or a separately published npm registry artifact.

## Why the packed-consumer test exists

Source tests and bundler-based tests can pass while emitted ESM is unusable by native Node. The packed-consumer smoke closes that gap by testing the same artifact shape a downstream package consumer receives.
