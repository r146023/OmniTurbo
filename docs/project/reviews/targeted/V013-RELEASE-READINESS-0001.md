# Release-Focused Governance and Issue Review — OmniTurbo v0.1.3 Candidate

**Record:** V013-RELEASE-READINESS-0001
**Date:** 2026-11-18
**Type:** Targeted release-focused Governance Due Check and relevant Issue review
**Status:** **BLOCKED for release publication — current full security-audit gate FAIL**
**Project:** OmniTurbo, governed by published WA v5.7.0
**Related Work Unit:** WU-0002, accepted WU serial **1** before WU-0002; no WU-0002 acceptance yet
**Sources:** `docs/private/PROJECT_DATA.md`, `docs/project/reviews/INDEX.md`, `docs/releasing.md`, WA `RELEASE_STANDARD.md` §§2–4 and `PROJECT_REVIEW_AND_AUDIT_STANDARD.md` §§7–8, and both current individual Issue records.

## Governance Due Check

- **Cadence:** Accepted native WA serial **1**, Governance/Structure ordinary cadence **3**, Integrity ordinary cadence **9**. No cadence review is due at serial 1.
- **Event:** A new `v0.1.3` package is being prepared, so a **release-focused Issue review and readiness check is due** before a tag/release can be created. This record performs the scoped Issue review and documents the unmet gate; it does **not** declare a release ready or approve publication.
- **Major structural/architectural transition:** The WU-0001 subscriber exception fix is bounded within existing subscription/result behavior, not a separately approved architectural baseline or major repository reorganization; no additional event-triggered whole-project Integrity Audit is established by this scoped release check. Re-evaluate if release scope materially changes.
- **No normal next Work Unit is approved** by this review. WU-0002 remains the only currently authorized Work Unit.

## Release-focused Issue review

### ASSISTANT-ISSUE-0001 — Subscriber exception isolation

**State:** Confirmed, Resolution **Verified**, Closure **Open**. The corrective code and WU-0001 closeout were Owner-approved and integrated into OmniTurbo `main` by PR #5 at `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`. Both supported Node runtimes pass the package-consumer and regression suite using the candidate `0.1.3` package. The currently **published `v0.1.2`** remains affected; Issue closure awaits a qualified successor release and any normal accepted evidence. This Issue does not authorize publication.

### ASSISTANT-ISSUE-0002 — Existing development-tooling security audit

**State:** Confirmed, Open, High, U2; separate Owner direction defers dependency remediation and disallows making it a blocker to the approved source-integration/candidate-development work. No dependency remediation or CI suppression was approved.

**Observed in WU-0002:** Using the unchanged dependency graph with root package metadata changed only from `0.1.2` to `0.1.3`, `npm audit --audit-level=high` fails on both Node 22 and Node 24: **9 findings — 4 moderate, 3 high, 2 critical**. Historical onboarding audit observations of **12 findings** remain evidence for that earlier run; advisory counts are snapshot observations and are not by themselves proof of a package graph upgrade or remediation.

**Risk context, not a substitute for the gate:** OmniTurbo declares **zero runtime dependencies**, and `npm audit --omit=dev --audit-level=high` passes with **zero advisories**. The full CI audit (including tooling) is still required by current project contract.

**Owner timing remains deferred.** No repair campaign or unrelated dependency Work Unit was started.

## Qualification and readiness result

| Requirement | Evidence | Result |
|---|---|---|
| Accepted fixed source on authoritative `main` | PR #5 merged at `32b5ab8...` | **PASS** |
| Package `0.1.3` root and lock metadata agree | `package.json` and `package-lock.json`, only root version field changes | **PASS (candidate)** |
| Exact lockfile installation | `npm ci` Node 22.23.5 and 24.19.0 | **PASS both** |
| Typecheck, unit regression, build | `npm run verify` | **PASS both; 138/138 tests each** |
| Native ESM packed consumer and package contents | `npm run test:package`, `npm run pack:check` | **PASS both** |
| Production graph security audit | `npm audit --omit=dev --audit-level=high` | **PASS; 0 advisories** |
| Required full security audit | `npm audit --audit-level=high` | **FAIL on both; 9 advisories** |
| GitHub Actions overall green Node 22 and 24 release gate | [PR #6 Actions run 44364565254](https://github.com/r146023/OmniTurbo/actions/runs/44364565254): `npm ci` PASS, full audit FAIL, subsequent source/package `verify` step SKIPPED on both Node 22 and 24 | **FAIL at existing security-audit gate** |
| WU-0002 Owner acceptance | Work Unit still Active / awaiting appropriate review or decision | **NOT YET ACCEPTED** |
| Matching new `v0.1.3` immutable tag and published artifacts | No tag/Release or npm publication created | **NOT RUN / NOT AUTHORIZED** |

## Decision boundary

**RELEASE-READINESS STATUS: BLOCKED.** Current `docs/releasing.md` expressly requires full audit success; published WA `RELEASE_STANDARD.md` §4 prohibits publication when readiness checks fail. The Owner's existing *timing deferral* is not a version-specific release-contract modification.

The next release decision must explicitly distinguish either:

- **Keep the existing full-audit requirement:** release publication remains blocked until a separately authorized dependency/toolchain remediation and full requalification pass; or
- **Propose a version-specific documented exception for the existing development-tooling graph:** requires an explicit Project Owner security-risk/release-contract decision and whatever separately authorized governance/source changes are necessary; keep producing the audit report and preserve the unaffected published `v0.1.2`, do not silently suppress or present an exception as a PASS.

Do **not** tag, publish, self-approve a waiver, change CI or modify dependencies under this record. Candidate evidence and the chosen Owner decision must be preserved prior to any future release transition.

## Scope and historical outcome

This is a narrow candidate release-focused review, **not** a general Integrity Audit, dependency investigation, release approval, new WU, or acceptance of WU-0002. No changes to another project. The report is current evidence for an explicit future Owner disposition, not an independent source of authority to change the release process.
