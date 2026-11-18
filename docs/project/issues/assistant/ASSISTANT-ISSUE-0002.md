# ASSISTANT-ISSUE-0002 — Existing dependency audit gate fails on Node 22 and 24

**ID:** `ASSISTANT-ISSUE-0002`
**Origin:** Planning and Development Assistant (discovered during WA 5.7.0 adoption PR verification)
**Type:** Infrastructure / security-maintenance risk
**Investigation State:** Confirmed; remediation Verified on accepted source and actual released `v0.1.4` package
**Severity:** High (CI reports critical/high dependency advisories; runtime exposure not established)
**Urgency:** Historical U2; **Closed** following Owner-approved WU-0003 release verification
**Blocks:** **Resolved for current published `v0.1.4`** through a normal full-audit PASS with zero findings. Historical `v0.1.3` tooling advisories remain in that immutable release, covered only by its earlier version-specific Owner exception; they do not carry forward as a waiver.
**Closure State:** Closed
**Closure Reason:** WU-0003 Owner-approved Vitest/Rimraf development-tooling remediation, integrated in OmniTurbo PR #8 and released as official `v0.1.4` from source `94769f173828cc622628c7b2889cd94d60e902ac`. Published full and production audit JSON both contain **zero** findings, release checksums match, and the actual published npm tarball passed a fresh native ESM consumer regression. Historical `v0.1.3` and its one-version exception remain unchanged.
**Reported:** 2026-11-18
**Last Reviewed:** 2026-11-18 — WU-0003 Owner acceptance, normal-gate `v0.1.4` publication and independent release/audit verification
**Next Review Trigger:** None while Closed. New advisories in future lockfiles/releases are separate evidence and require normal Issue triage; do not silently reactivate the historical `v0.1.3` exception.
**Affected Versions / Stages:** Historical published `v0.1.3` dev-tooling graph remains affected and unchanged. The current published `v0.1.4` replaces its vulnerable toolchain graph and reports full/production audits PASS with zero findings; no runtime API/source behavior changed.
**Environment:** GitHub Actions CI workflow, Node 22 and Node 24 jobs, push and pull_request runs on governance-only PR #4

## Original Report

While verifying the governance-only WA 5.7.0 adoption candidate, both Node 22 and Node 24 CI jobs failed at `npm audit --audit-level=high` after successful `npm ci`. The next `npm run verify` step was skipped. This failure was not introduced by the governance documents: `package.json`, `package-lock.json`, CI workflow and source are identical to the pre-adoption commit.

## Original Onboarding Understanding (Historical; Superseded by Current Decision Summary)

CI runs `npm ci`, then a full `npm audit --audit-level=high`. The advisory database currently reports **12 vulnerabilities (4 moderate, 6 high, 2 critical)** involving development/build/test tooling such as Vitest/Vite transitive dependencies, `tinypool`, `picomatch`, `source-map-js` and others. Some reported fixes may require a breaking Vitest upgrade. These are **tooling/dependency-graph advisories**, not evidence that OmniTurbo's packaged runtime API has an exploitable vulnerability.

## Observed Behavior

- Push CI run [44333869612](https://github.com/r146023/OmniTurbo/actions/runs/44333869612) failed on Node 22 and 24.
- Pull-request CI run [44334008009](https://github.com/r146023/OmniTurbo/actions/runs/44334008009) failed on Node 22 and 24.
- The failure is in the audit step; the install passed and source/build/package tests were skipped.
- `package-lock.json` has identical Git blob SHA `a6cabee23959d18708d2f383c14af6a4f7957045` in both PR head and its parent baseline.

## Expected Behavior

The project's established release/CI contract requires the high-severity dependency audit and the complete `npm run verify` sequence to pass before representing a package candidate as release-ready.

## Reproduction

1. Use the unchanged `v0.1.2` lockfile.
2. Run the CI workflow as defined in `.github/workflows/ci.yml` on Node 22 and 24.
3. Observe that `npm ci` succeeds, but `npm audit --audit-level=high` exits 1 before `npm run verify`.

## Evidence

- [GitHub Actions push CI run](https://github.com/r146023/OmniTurbo/actions/runs/44333869612)
- [GitHub Actions PR CI run](https://github.com/r146023/OmniTurbo/actions/runs/44334008009)
- `.github/workflows/ci.yml` current `npm audit --audit-level=high` contract
- Lockfile and package metadata unchanged in PR #4
- Existing unrelated Dependabot development-tooling PR #3 may be relevant, but its suitability as remediation was **not** established

## Impact

The red audit gate prevents a truthful claim that the current package CI qualified. It introduces a governance/merge decision for a documentation-only adoption PR and may block a subsequent subscriber-fix release gate even if source tests later pass. The affected packages appear in the development tooling graph; do not conflate the audit findings with demonstrated exploitable runtime vulnerabilities.

## Root Cause

New/current security advisories affecting the existing locked development dependency graph. No evidence of a WA-docs-caused failure. Precise advisory fixes and compatible upgrade options have not been qualified.

## Resolution

### Resolution State

`Verified / Released` — Owner-approved WU-0003 updates Vitest to 5.1.1 and Rimraf to 6.1.4 while retaining TypeScript 5.9.3; complete Node 22/24 CI, full and production audits PASS with zero findings. Official `v0.1.4` release tarball and audit/checksum assets were independently downloaded and verified; Issue **Closed**. Historical `v0.1.3` is unaffected.

### Proposed Resolution

Evaluate a separately bounded tooling/dependency remediation, possibly in light of the existing Dependabot PR #3, preserving runtime/API contracts and full Node 22/24 package qualification. Do not automatically run `npm audit fix --force`, weaken the audit gate, or combine tooling changes with the subscriber correction.

### Approved Resolution

Project Owner explicitly accepted WU-0003 on RamonaFlowers and subsequently issued exact `I APPROVE` for the fully qualified WU-0003 review before merge/tag/publication. Approved correction was merged to `main` via PR #8 and released as official `v0.1.4` after normal full audit PASS.

### Resolution Decision Evidence

2026-11-18 Owner exact `I ACCEPT OMNITURBO WU-0003 — REMEDIATE THE NINE CURRENT DEVELOPMENT-TOOLING SECURITY FINDINGS ...` authorizes scoped remedial execution and testing, **not** release publication, formal Issue closure or WU-0003 final acceptance.

## Timing

### Timing State

`Timing Approved`

### Proposed Timing

Defer toolchain dependency remediation until after the time-critical OmniTurbo subscriber correction and AVAM handoff. Keep security-audit failures visible; any future package-release readiness exception remains a separate Owner decision.

### Approved Timing

After the OmniTurbo subscriber-isolation corrective effort and AVAM's critical-path handoff. No immediate investigation or dependency-upgrade Work Unit. The existing audit gate remains enabled, and red CI cannot be characterized as passing.

### Timing Decision Evidence

2026-11-18 Project Owner instruction: do not investigate or hold current projects hostage over this now; OmniTurbo needs to progress for AVAM, and the dependency issue can be resolved afterward.

## Verification Requirements

- Reproducible lockfile install and completed high-severity audit with no unapproved suppression.
- Node 22/24 `npm run verify` source, build, packed-consumer qualification.
- No unrelated public API or runtime behavior changes.
- Correct classification of production-vs-development dependency risk.

## Implementation / Verification Evidence

Historical onboarding: no dependency patch was authorized then. Subsequently Owner-authorized WU-0003 remediated the dev-tooling findings. [PR #8](https://github.com/r146023/OmniTurbo/pull/8) merged at `94769f173828cc622628c7b2889cd94d60e902ac`; [v0.1.4 official release](https://github.com/r146023/OmniTurbo/releases/tag/v0.1.4) published under [Release run 44385410307](https://github.com/r146023/OmniTurbo/actions/runs/44385410307) (PASS). Actual published full and production audit JSON both contain zero findings; the published installable tarball and SHA256SUMS match; separate native ESM installed-package subscriber regression PASS. Exact immutable evidence: `docs/project/releases/V0.1.4-RELEASE-VERIFICATION.md`.

## Related Authorities and Work Units

- `docs/releasing.md` release qualification contract.
- `docs/project/reviews/integrity/AUDIT-0001.md`
- Governance-only adoption PR #4.
- Existing Dependabot PR #3 (not yet accepted as a fix).

## Review History

- Initial WA onboarding CI verification 2026-11-18.
- 2026-11-18 Project Owner explicitly deferred remediation and chose not to block WA adoption or subscriber correction over the pre-existing CI failure. This is a scheduling/priority decision, not an assertion that the vulnerabilities are gone or the package is release-qualified.
- 2026-11-18 WU-0002 release-focused check: current `npm audit --audit-level=high` FAIL on Node 22.23.5 / Node 24.19.0 with **9 vulnerabilities (4 moderate / 3 high / 2 critical)**, rather than the earlier snapshot count of 12. `npm audit --omit=dev --audit-level=high` PASS, 0 advisories; no runtime dependencies are declared. Full audit remains mandated by `docs/releasing.md`. This observation is not a new investigation, a fix, or an Owner-approved waiver. See `docs/project/reviews/targeted/V013-RELEASE-READINESS-0001.md`.

## Current Decision Summary

**Closed / Verified and Released (2026-11-18).** WU-0003 was Owner-approved, merged by PR #8, and fully qualified under the **unexcepted normal audit gate**, with actual published `v0.1.4` full and production audit evidence both **0 findings** and fresh installed-package verification PASS. This resolves the current development-tooling risk. The old published `v0.1.3` and its limited historical exception remain immutable. No future dependency or project work is authorized by this closeout.
