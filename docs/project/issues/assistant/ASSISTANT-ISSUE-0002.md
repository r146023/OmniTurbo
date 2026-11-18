# ASSISTANT-ISSUE-0002 — Existing dependency audit gate fails on Node 22 and 24

**ID:** `ASSISTANT-ISSUE-0002`
**Origin:** Planning and Development Assistant (discovered during WA 5.7.0 adoption PR verification)
**Type:** Infrastructure / security-maintenance risk
**Investigation State:** Confirmed
**Severity:** High (CI reports critical/high dependency advisories; runtime exposure not established)
**Urgency:** U1 — decision before a green-CI-required merge or release
**Blocks:** Current green CI checks for adoption PR #4 and future normal package-release readiness; does not prove governance documentation is defective
**Closure State:** Open
**Closure Reason:** N/A
**Reported:** 2026-11-18
**Last Reviewed:** 2026-11-18 audit follow-up
**Next Review Trigger:** Owner decision on PR #4 governance integration under pre-existing red checks; any subsequent tooling remediation or release qualification
**Affected Versions / Stages:** Existing OmniTurbo `v0.1.2` lockfile and CI; separate from subscriber-isolation implementation
**Environment:** GitHub Actions CI workflow, Node 22 and Node 24 jobs, push and pull_request runs on governance-only PR #4

## Original Report

While verifying the governance-only WA 5.7.0 adoption candidate, both Node 22 and Node 24 CI jobs failed at `npm audit --audit-level=high` after successful `npm ci`. The next `npm run verify` step was skipped. This failure was not introduced by the governance documents: `package.json`, `package-lock.json`, CI workflow and source are identical to the pre-adoption commit.

## Current Understanding

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

`No Resolution Proposed` — investigation has identified the CI gate, but a safe compatible dependency upgrade is not qualified.

### Proposed Resolution

Evaluate a separately bounded tooling/dependency remediation, possibly in light of the existing Dependabot PR #3, preserving runtime/API contracts and full Node 22/24 package qualification. Do not automatically run `npm audit fix --force`, weaken the audit gate, or combine tooling changes with the subscriber correction.

### Approved Resolution

N/A.

### Resolution Decision Evidence

N/A — no separate Owner authorization yet.

## Timing

### Timing State

`Unscheduled`

### Proposed Timing

Before representing a future package candidate as release-ready; decide separately whether the pre-existing red CI should block administrative governance-only PR #4 integration.

### Approved Timing

N/A.

### Timing Decision Evidence

N/A.

## Verification Requirements

- Reproducible lockfile install and completed high-severity audit with no unapproved suppression.
- Node 22/24 `npm run verify` source, build, packed-consumer qualification.
- No unrelated public API or runtime behavior changes.
- Correct classification of production-vs-development dependency risk.

## Implementation / Verification Evidence

None — no dependency patch or CI bypass authorized by this documentation onboarding.

## Related Authorities and Work Units

- `docs/releasing.md` release qualification contract.
- `docs/project/reviews/integrity/AUDIT-0001.md`
- Governance-only adoption PR #4.
- Existing Dependabot PR #3 (not yet accepted as a fix).

## Review History

- Initial WA onboarding CI verification 2026-11-18.

## Current Decision Summary

Confirmed pre-existing CI audit failure with no in-scope remediation. Record as an independent issue, do not expand the governance or subscriber-correction scope, and surface the Owner decision before a protected merge/release transition.
