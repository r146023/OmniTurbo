# Releasing OmniTurbo

OmniTurbo releases must prove the packaged artifact, not only the source tree.

## Supported runtime

OmniTurbo supports maintained Node.js releases beginning with Node 22. Permanent CI qualifies the package on Node 22 and Node 24. The repository uses current major versions of the official GitHub checkout/setup-node actions so CI does not depend on deprecated action runtimes.

## Release contract

A release is valid only when all of the following are true:

1. `npm ci` reconstructs the exact lockfile graph.
2. `npm audit --audit-level=high` passes.
3. `npm run typecheck` passes under NodeNext so invalid native-ESM relative specifiers fail at compile time.
4. `npm test` passes with the complete existing behavior suite.
5. `npm run build` emits `dist/` successfully.
6. `npm run test:package` packs the library, installs that tarball into a fresh temporary consumer, imports `@r146023/omniturbo` with native Node ESM, constructs `Omni`, and performs a set/get smoke.
7. `npm run pack:check` confirms the publish payload.
8. The Git tag exactly matches `package.json` version as `v<version>`.

`npm run verify` performs the source/build/package checks used by CI and the release workflow. CI runs that contract independently on Node 22 and Node 24.

## GitHub release procedure

1. Merge an already-qualified release change to `main`.
2. Update `package.json` and `package-lock.json` to the intended version in the reviewed release change.
3. Create and push the matching tag, for example `v0.1.2`.
4. `.github/workflows/release.yml` re-runs the full verification contract on Node 24.
5. The workflow creates (or updates) the GitHub Release and uploads:
   - the installable `npm pack` `.tgz` artifact;
   - `SHA256SUMS` for the release artifact.

A GitHub source zip/tarball is not considered the installable OmniTurbo package. Consumers that need a deterministic release artifact should use the `.tgz` attached to the GitHub Release or a separately published npm registry artifact.

## npm publication

The GitHub Release pipeline does not require npm registry credentials and therefore always produces a reviewable installable artifact. npm registry publication may be added or executed separately; it must publish the same already-qualified package contents rather than becoming a different build path.

If automated npm publication is added later, prefer npm Trusted Publishing/OIDC over a long-lived repository token, and keep the packed-consumer/release verification gate before publication.

## Why the packed-consumer test exists

Source tests and bundler-based tests can pass while emitted ESM is unusable by native Node. The packed-consumer smoke closes that gap by testing the same artifact shape a downstream package consumer receives.

This test exists specifically to prevent the failure class found in `0.1.1`, where bundler-oriented TypeScript resolution allowed extensionless relative ESM specifiers into `dist/`; the source/tests built successfully, but a real native Node package consumer could not import the release.
