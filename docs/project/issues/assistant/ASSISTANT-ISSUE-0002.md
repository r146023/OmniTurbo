# ASSISTANT-ISSUE-0002 — Existing dependency audit gate fails on Node 22 and 24

**ID:** `ASSISTANT-ISSUE-0002`
**Origin:** Planning and Development Assistant (discovered during WA 5.7.0 adoption PR verification)
**Type:** Infrastructure / security-maintenance risk
**Investigation State:** Confirmed; remediation locally Verified in WU-0003 candidate (unaccepted)
**Severity:** High (CI reports critical/high dependency advisories; runtime exposure not established)
**Urgency:** U2 — Owner-authorized bounded WU-0003 remediation, currently in candidate verification
**Blocks:** The published `v0.1.3` development-tooling graph has historic findings under its Owner-approved one-version exception. The proposed `v0.1.4` WU-0003 candidate resolves those findings with a real **normal full audit PASS (0 findings)**; remaining boundaries are exact GitHub CI, Owner acceptance and controlled successor release. This formal Issue remains Open until its accepted disposition, not merely local candidate checks.
**Closure State:** Open
**Closure Reason:** N/A
**Reported:** 2026-11-18
**Last Reviewed:** 2026-11-18 — WU-0003 v0.1.4 local Node 22/24 security-remediation candidate qualification
**Next Review Trigger:** WU-0003 GitHub CI/mandatory Owner review and, after acceptance, separate release-qualification/publication; no Issue closure before authority and evidence.
**Affected Versions / Stages:** Published historical `v0.1.3` dev-tooling graph remains affected; the unaccepted `v0.1.4` candidate contains a locally verified compatible remediation, with no change to runtime/source behavior.
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

`Implemented / Locally Verified Candidate` — WU-0003 upgrades Vitest 3.2.6 → 5.1.1 and Rimraf 6.1.3 → 6.1.4, retaining TypeScript 5.9.3, with zero vulnerabilities and full Node 22/24 package verification. **Open until Owner approval and accepted successor-release evidence.**

### Proposed Resolution

Evaluate a separately bounded tooling/dependency remediation, possibly in light of the existing Dependabot PR #3, preserving runtime/API contracts and full Node 22/24 package qualification. Do not automatically run `npm audit fix --force`, weaken the audit gate, or combine tooling changes with the subscriber correction.

### Approved Resolution

N/A.

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

Original governance onboarding: no dependency patch authorized or applied. Subsequently the Owner authorized WU-0003 on 2026-11-18. Candidate evidence: `docs/project/reviews/work-units/WU-0003-DEVTOOL-SECURITY-REMEDIATION.md`, `docs/project/releases/V0.1.4-CANDIDATE.md`; current direct dev tooling upgrade and exact npm audits PASS with zero, Node 22/24 package verification PASS without disabling or bypassing audits.

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

**Open / U2; implementation verified in the unaccepted WU-0003 v0.1.4 candidate.** The 2026-11-18 Owner `I ACCEPT OMNITURBO WU-0003` authorized the previously deferred dev-tooling remediation within OmniTurbo. A minimal two-direct-dependency update (Vitest 5.1.1, Rimraf 6.1.4; TypeScript 5.9.3 retained) produces **full and production-only npm audit PASS / zero findings**, plus complete Node 22/24 tests, native packaged consumer and normal gate PASS without exception. WU-0003 remains Active Work / pending full Owner review, and no successor version has been merged, tagged or published. Historical published `v0.1.3` risk and its frozen one-version exception remain unchanged. This Issue is not Closed until the accepted release disposition supports closure.
