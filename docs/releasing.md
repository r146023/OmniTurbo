# Releasing OmniTurbo

OmniTurbo releases must prove the packaged artifact, not only the source tree.

## Supported runtime

OmniTurbo supports maintained Node.js releases beginning with Node 22. Permanent CI qualifies the package on Node 22 and Node 24. The repository uses current major versions of the official GitHub checkout/setup-node actions so CI does not depend on deprecated action runtimes.

## Release contract

A release is valid only when all of the following are true:

1. `npm ci` reconstructs the exact lockfile graph.
2. `npm audit --audit-level=high` passes. **Only for `v0.1.3`**, after the separately required Project Owner `I APPROVE` and approved source/policy integration, the narrow documented development-tooling exception below may satisfy this *release readiness gate* without representing the full audit as passing. The full audit must still execute and remain visible.
3. `npm run typecheck` passes under NodeNext so invalid native-ESM relative specifiers fail at compile time.
4. `npm test` passes with the complete existing behavior suite.
5. `npm run build` emits `dist/` successfully.
6. `npm run test:package` packs the library, installs that tarball into a fresh temporary consumer, imports `@r146023/omniturbo` with native Node ESM, constructs `Omni`, and performs a set/get smoke.
7. `npm run pack:check` confirms the publish payload.
8. The release identity exactly matches `package.json` as `v<version>`.

`npm run verify` performs the source/build/package checks used by CI and the release workflow. CI runs that contract independently on Node 22 and Node 24.

## Preferred GitHub release procedure

1. Merge an already-qualified release change to `main` with `package.json` and `package-lock.json` already set to the intended version.
2. Open **Actions → Release → Run workflow** on `main`.
3. Enter the exact package version, for example `0.1.2`.
4. The workflow refuses to proceed unless the input exactly matches `package.json` and it is running from `main`.
5. The workflow reconstructs/audits the dependency graph and re-runs the complete package verification contract on Node 24.
6. It creates the matching Git tag and GitHub Release, then uploads:
   - the installable `npm pack` `.tgz` artifact;
   - `SHA256SUMS` for the release artifact.

A conventional pushed `v*.*.*` tag is also supported. In that mode the workflow verifies that the tag matches `package.json` before producing or updating the release artifacts.

A GitHub source zip/tarball is not considered the installable OmniTurbo package. Consumers that need a deterministic release artifact should use the `.tgz` attached to the GitHub Release or a separately published npm registry artifact.

## Dependency maintenance

Dependabot checks both npm development tooling and GitHub Actions weekly. Dependency changes still pass through the same permanent CI contract before they should be merged; automated discovery is not automatic acceptance.

## npm publication

The GitHub Release pipeline does not require npm registry credentials and therefore always produces a reviewable installable artifact. npm registry publication may be added or executed separately; it must publish the same already-qualified package contents rather than becoming a different build path.

If automated npm publication is added later, prefer npm Trusted Publishing/OIDC over a long-lived repository token, and keep the packed-consumer/release verification gate before publication.

## Why the packed-consumer test exists

Source tests and bundler-based tests can pass while emitted ESM is unusable by native Node. The packed-consumer smoke closes that gap by testing the same artifact shape a downstream package consumer receives.

This test exists specifically to prevent the failure class found in `0.1.1`, where bundler-oriented TypeScript resolution allowed extensionless relative ESM specifiers into `dist/`; the source/tests built successfully, but a real native Node package consumer could not import the release.

## v0.1.3-only Owner-accepted development-tooling risk exception (candidate pending final approval)

The Project Owner explicitly authorized preparing a **single-release exception for v0.1.3** on 2026-11-18 after reviewing the nine known development-tooling findings, **including two critical**, while deferring toolchain remediation. That material scope expansion did not authorize any immediate merge, tag or publication: the WU-0002 change and this policy **must separately receive Owner `I APPROVE`** before integrating into `main` or invoking release automation.

Only for `package.json.version === "0.1.3"`, `scripts/verify-audit-gate.mjs` runs both actual npm audits and permits the otherwise failing *full* audit **only when all of the following are true**:

1. Both full `npm audit --audit-level=high --json` and production-only `npm audit --omit=dev --audit-level=high --json` execute, with their complete JSON printed to CI/release logs, preserved in workflow artifacts, and eventually attached to the GitHub Release alongside the installable package and `SHA256SUMS`.
2. The production-only audit exits 0 and reports **zero findings**, and no production or optional dependencies have been added.
3. The v0.1.3 `package-lock.json` (normalized to LF line endings) matches the exact Owner-reviewed SHA-256 `7472d9045748abe5de7df3046a558341b2f8bf31c570ca4a45e8005bea6fa254`. Any dependency graph change invalidates the exception.
4. The full audit finds only the **specifically enumerated known GHSA advisory IDs and transitive vulnerable package entries** frozen in `scripts/audit-exception-policy.mjs`; there are no new vulnerable packages, advisories, dependency locations, or severity escalations. The observed counts may only decrease from the approved ceiling **4 moderate / 3 high / 2 critical / 9 total**. Unexpected audit errors, malformed reports, or missing evidence **fail closed**.
5. Node 22 and Node 24 full typecheck, 138 existing tests, policy negative self-tests, build, fresh native-ESM packed consumer and pack-content checks must pass. GitHub CI must actually execute them after the gated audit; local-only verification does not substitute for GitHub CI.
6. The accepted WU-0002 source and version-specific policy are integrated into authoritative `main` after Owner approval, the intended version/tag/release identity is **v0.1.3**, and the release-focused Issue review and other WA gates remain satisfied.

The exception is **not** a successful full `npm audit`. The automation must print `OWNER_ACCEPTED_EXCEPTION` and a visible security warning, not `PASS`, when the dev-tooling exception applies. Other versions, and any v0.1.3 with a changed lockfile or advisory set, retain the ordinary fatal audit gate. The current `ASSISTANT-ISSUE-0002` remains Open and scheduled for subsequent remediation, with no silent auto-upgrade, npm audit suppression or disabling of the audit checks.

**Publication controls:** No automated action should be started until the Project Owner approves the WU-0002 delivery with `I APPROVE` and the authorized integration is complete. For v0.1.3 the release workflow must refuse to overwrite an existing GitHub Release, create or verify a matching immutable tag from accepted `main`, use `docs/project/releases/V0.1.3-PUBLIC-RELEASE-NOTES.md` for transparent risk disclosure, and attach `SECURITY-AUDIT-FULL.json`, `SECURITY-AUDIT-PRODUCTION.json`, the installable `.tgz`, and matching `SHA256SUMS`. This preparation **does not create a release**. Normal release security requirements resume for all other versions.
