# Release-Focused Governance and Issue Review — OmniTurbo v0.1.3 Candidate

**Record:** V013-RELEASE-READINESS-0001
**Date:** 2026-11-18
**Type:** Targeted release-focused Governance Due Check and relevant Issue review
**Status:** **v0.1.3-only risk exception candidate is tested and Awaiting WU-0002 Owner acceptance.** Full audit remains FAIL (nine known findings); strict exception is separately visible in successful Node 22/24 CI, with raw audit artifacts retained. No release/tag before final `I APPROVE` and integration.
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

## Subsequent Owner risk decision and proposed controlled exception — 2026-11-18

The Owner expressly accepted **nine known dev-tooling findings (including two critical) for v0.1.3 only** and expanded the existing WU-0002 scope on RamonaFlowers to prepare a guarded release exception while deferring dependency maintenance. The Owner requires a **separate `I APPROVE` before PR merge, tag or publication**. This supersedes the earlier “no exception authorized” *decision status* for candidate preparation only, without altering the factual full-audit FAIL evidence above.

**Prepared exception (candidate, pending final approval):**
- `scripts/audit-exception-policy.mjs` freezes the exact v0.1.3 LF-normalized lockfile SHA-256, observed maximum nine package findings (4 moderate, 3 high, 2 critical), exact allowed package names and GHSA IDs, and individual severity/production-scope boundaries. New advisory ID, severity escalation, lockfile alteration or different version **FAILS**.
- `scripts/verify-audit-gate.mjs` executes **both real audits**, preserves complete JSON output, and returns a visible `OWNER_ACCEPTED_EXCEPTION` only for the known dev-only risk; never labels a failing full audit as PASS. Production-only audit must pass with **zero findings**.
- `.github/workflows/ci.yml` and `release.yml` retain audit logs and downloadable reports. GitHub Release candidate includes installable `.tgz`, both raw JSON audit reports, checksums and version-specific public risk disclosure. For v0.1.3, publication refuses to overwrite a prior release.
- The ordinary fatal high-level audit requirement remains in force for every other package version and for any v0.1.3 input outside the approved fingerprint.

**Prerequisites still mandatory:** reviewed/accepted WU-0002 with `I APPROVE`, candidate PR integrated to authoritative `main`, Node 22/24 true CI package/build/negative-policy tests, secure matching tag/version identity, exact real audit reports and no new unexpected findings. This targeted review documents the bounded Owner decision, not a blanket security exception or completed/publicly published release.

The original `ASSISTANT-ISSUE-0002` stays **Open** and toolchain remediation deferred. After a v0.1.3 release, the exception expires by version; it is not used for v0.1.4 or later.

## Completed exception-preparation verification — 2026-11-18

**GitHub Actions CI now passes** on Node 22 and Node 24 under the specifically Owner-authorized, policy-fingerprinted `v0.1.3` candidate exception. [CI run 44373604315](https://github.com/r146023/OmniTurbo/actions/runs/44373604315) at implementation/review head `ad46aa2a37bf3aa0b0b4da2b9b27d130f12ff14a` confirms in **both jobs**: `npm ci` PASS, actual full/prod audit guard **PASS WITH EXPLICIT EXCEPTION**, subsequent `npm run verify` PASS, 138/138 library tests, 14 policy self-tests, build and packed-consumer qualification.

**Actual audit:** Full audit still exits **1** with 9 package findings (4 moderate, 3 high, 2 critical). The machine-readable release policy marks `OWNER_ACCEPTED_EXCEPTION`, not a full-audit `PASS`. Production-only audit exits **0** with 0 findings. The exact lockfile SHA-256 and the known GHSA fingerprint were checked on both Node jobs.

**Evidence retention:** Initial PR #6 run [44373143044](https://github.com/r146023/OmniTurbo/actions/runs/44373143044) passed unit/source/package checks but its `upload-artifact` action defaulted to excluding the hidden `.release-audit` directory and uploaded nothing. The upload configuration was corrected and made fail-closed in commit `ad46aa2a37bf3aa0b0b4da2b9b27d130f12ff14a`. Run 44373604315 now has **both actual downloadable CI artifacts**, `security-audit-node-22` and `security-audit-node-24`. Both were downloaded in a separate local inspection workspace and directly read back: each contains `full.json` (11,708 bytes; 9 findings including 2 critical) and `production.json` (363 bytes; 0 findings). This is **PASS** for the Owner's audit-visibility requirement.

**Version protection:** Policy tests reject other versions, changed lockfile, unrecognized vulnerable packages and GHSA advisories, elevated individual advisory severity, new production dependencies and nonzero production audits. `v0.1.3` public release notes are prepared with an explicit development-tooling risk notice.

**Current release-readiness consequence:** The known dev-tooling findings remain, and Issue `ASSISTANT-ISSUE-0002` is still Open/deferred. The narrowly accepted *version-specific exception candidate* and release workflow are ready for the separate WU-0002 Owner acceptance gate. PR #6 is not merged, no `v0.1.3` tag exists, and no release has been published; those steps are prohibited until `I APPROVE`.
