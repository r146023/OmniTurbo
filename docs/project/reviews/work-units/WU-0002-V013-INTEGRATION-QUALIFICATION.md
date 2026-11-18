# WU-0002 — Integrate Accepted Subscriber Correction and Qualify v0.1.3

**Project:** OmniTurbo
**Governing Working Agreement:** v5.7.0, immutable official release
**Current Work Unit State:** Awaiting Review — the Owner-authorized v0.1.3-only dev-tooling exception, full audit evidence and release preparation are qualified under the exact agreed boundary. No WU-0002 `I APPROVE`, PR merge, tag or publication has occurred.
**Date Authorized:** 2026-11-18
**Execution Machine:** RamonaFlowers
**Accepted WU Predecessor:** WU-0001, Owner-approved/Closed; accepted serial `1`
**Working Branch:** `work/wu-0002-v0.1.3-qualification`
**Base:** `main` at `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`, after Owner-authorized merge of [PR #5](https://github.com/r146023/OmniTurbo/pull/5)

## Exact Owner authorization

```text
I ACCEPT OMNITURBO WU-0002 — INTEGRATE THE APPROVED SUBSCRIBER CORRECTION AND PREPARE AND QUALIFY V0.1.3 ON RAMONAFLOWERS
```

## Authorized outcome and envelope

1. Integrate previously approved/Closed WU-0001 subscriber exception isolation and governance closeout via exact inspected PR #5, without changes to its accepted source implementation.
2. Prepare a new patch-version `0.1.3` candidate with synchronized `package.json` and root lockfile version metadata. Preserve all dependency graph versions and the immutable released `v0.1.2` tag/artifacts.
3. Verify exact source and package behavior on supported Node 22 and Node 24 with clean installs, all tests, typecheck, build, fresh packed native ESM consumer and pack contents; review release identity.
4. Preserve the pre-existing `ASSISTANT-ISSUE-0002` security-audit failure without fixing dependencies, disabling audit, suppressing advisories or asserting green CI.
5. Prepare release-ready instructions/notes as a **candidate**, distinguish `main` integration from an actual published version, and record exact successful/failed checks and remaining gates.
6. Deliver mandatory WA v5.7.0 Work Unit Review and stop at **Awaiting Review / any required release decision**.

## Explicit exclusions and stopping boundary

- No OmniTurbo npm dependency upgrades, lockfile graph re-resolution or security audit weakening; no unrelated source refactoring.
- No `v0.1.3` tag, GitHub Release creation, npm publication or overwrite of existing release; those require the full, separately governed `docs/releasing.md` readiness contract and subsequent Owner acceptance.
- No changes, audits, releases or authorizations for another repository.
- Do not advance the Accepted Work Unit Serial beyond `1` before WU-0002 receives distinct Owner `I APPROVE`.
- At a failed release readiness gate, report the exact deficit and require a **separate Project Owner release-gate disposition** rather than proceeding to publication.

## Initial factual state

- Before WU-0002, `v0.1.2` tag references `baeb6919ec9720a9506053a4acd284a12c842b54`; no `v0.1.3` tag or release existed.
- Accepted WU-0001 merged as PR #5 into `main` at `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041` on 2026-11-18. WU-0001 accepted serial `1` is present in authoritative `main`.
- Before this WU, `package.json` and `package-lock.json` were `0.1.2`. `npm version 0.1.3 --no-git-tag-version` changed only root version metadata in both files.
- `docs/releasing.md` requires `npm audit --audit-level=high` PASS and CI Node 22/24 verification; pre-existing development-tooling advisories previously caused the gate to fail. That failure does not prevent source integration/candidate qualification but **does prevent release publication absent appropriate separate authority and applicable contract compliance**.
- WU-0002 has no separately approved Development Plan Stage. The bounded Owner `I ACCEPT` defines this correction/integration and candidate qualification only.

## Execution and verification ledger

**Completed to the documented boundary:** approved source integration and `v0.1.3` candidate source/package checks pass on both Node 22 and Node 24. The full security-audit release gate fails, so release qualification and publication are **BLOCKED / Awaiting Owner decision**. No Owner acceptance or tag/release is asserted.

## Owner-Facing Work Unit Review — Blocked Release Gate

**Plain English:** The previously approved subscriber correction is now in OmniTurbo's authoritative `main`. A distinct `0.1.3` patch-version candidate is built and tested successfully on both supported Node versions, including native packaged-consumer verification. It cannot be described as a **fully release-qualified or published package** because the separate mandatory development-tooling security audit still fails.

**Why it matters:** The source correction is safely integrated and the candidate is technically usable, but the Project Owner must provide an explicit release-gate disposition before any versioned artifact can be published for consumers.

**Primary artifacts:** `docs/project/releases/V0.1.3-CANDIDATE.md` and `docs/project/reviews/targeted/V013-RELEASE-READINESS-0001.md`; this Work Unit review and its later review PR (once created).

**Decision / next action:** A bounded Owner risk/security disposition is required on the failed **full** `npm audit --audit-level=high` requirement. Do not send `CONTINUE` or `I APPROVE` as though the release gate had passed. The Owner may keep the existing contract (publication remains blocked pending separately authorized tooling remediation), or may explicitly authorize work on a narrowly scoped, one-version development-tooling risk exception with audit reporting retained and new material approval, before any tag/publication.

**Traceability:** WU-0002, Owner's exact `I ACCEPT` above; PR #5 integrated at `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`, accepted WU serial `1`. Source candidate `work/wu-0002-v0.1.3-qualification`; formal Issues `ASSISTANT-ISSUE-0001` and `ASSISTANT-ISSUE-0002`.

**Work Unit:** Integrate approved WU-0001 source and prepare/qualify `@r146023/omniturbo@0.1.3`.
**Authorization evidence:** Exact `I ACCEPT OMNITURBO WU-0002 — INTEGRATE THE APPROVED SUBSCRIBER CORRECTION AND PREPARE AND QUALIFY V0.1.3 ON RAMONAFLOWERS`.
**Development Plan / Stage:** N/A — no separately approved staged Development Plan; specifically bounded WU-0002.
**Base source:** `main` `ae0787427414206cde394516c2c3658f829d18c4` before integration, merged to `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`; candidate derived from integrated main.
**Result:** **Partial** — integration and technical source/package verification complete; **release-readiness BLOCKED**.
**Current state:** **Blocked / Awaiting Decision**, not accepted.
**Execution window:** 2026-11-18; PR #5 merged at 17:33:42 UTC. Precise full elapsed execution duration **not separately instrumented**, so not invented.

## Summary of Changes

### 1. Accepted source integration

- Verified the exact reviewed PR #5 head `282d2d05f83959f5b4c15c5d7c127967f2759ad0`, expected base `ae0787427414206cde394516c2c3658f829d18c4`, mergeability and unchanged main.
- Merged Owner-approved PR #5 without force operations; verified `main` `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041` and WU-0001 acceptance serial `1`.
- Original immutable `v0.1.2` tag remains `baeb6919ec9720a9506053a4acd284a12c842b54`.
- The subscriber implementation is unchanged in WU-0002; WU-0001 remains the acceptance/provenance authority for that correction.

**Verification:** GitHub merged PR #5 / main commit readback — **PASS**. No source regression introduced in WU-0002.

### 2. `0.1.3` candidate version preparation

- Applied `npm version 0.1.3 --no-git-tag-version` on isolated `work/wu-0002-v0.1.3-qualification`.
- Only `package.json` `version` and `package-lock.json` two root package-version fields changed; locked dependency versions/graph remain unchanged from `0.1.2`.
- Reconciled current `PROJECT_DATA`, Issue and Review indexes to distinguish accepted current `main`, historical `v0.1.2`, and unaccepted `v0.1.3` candidate without rewriting original WU-0001 historical review.
- Prepared `docs/project/releases/V0.1.3-CANDIDATE.md` and scoped `docs/project/reviews/targeted/V013-RELEASE-READINESS-0001.md`.
- Generated locally packed `r146023-omniturbo-0.1.3.tgz` (**52,971 bytes**), SHA-256 `8c67e32bd15c99cd25212695e8b4f44068f405943ecf95d80823406ffc76c5f5`, retained in isolated local QA scratch, **not published**.

**Verification:** Version identity `package.json`/`package-lock.json` root `0.1.3` — **PASS**. Git tag/release `v0.1.3` still nonexistent — **PASS boundary**.

### 3. Clean-install qualification, two supported Node versions

| Qualification | Node 22.23.5 | Node 24.19.0 |
|---|---|---|
| SHA-verified isolated runtime / existing runtime | PASS — official Node 22 archive | PASS — installed Node 24 |
| Exact-version metadata check | PASS | PASS |
| `npm ci --no-fund` | **PASS** | **PASS** |
| `npm run verify`: full typecheck + automated test suite | **PASS — 138/138 tests, 19 files** | **PASS — 138/138 tests, 19 files** |
| `npm run verify`: build | **PASS** | **PASS** |
| `npm run verify`: fresh installed native-ESM packed consumer | **PASS** | **PASS** |
| `npm run verify`: `pack:check` | **PASS** | **PASS** |
| `npm audit --omit=dev --audit-level=high` (supplemental production graph) | **PASS — 0 findings** | **PASS — 0 findings** |
| **Required full** `npm audit --audit-level=high` | **FAIL — 9 findings** | **FAIL — 9 findings** |
| Normal green GitHub Actions / full release contract | **FAIL at audit** on PR #6; `npm ci` PASS and later `verify` SKIPPED | **FAIL at audit** on PR #6; `npm ci` PASS and later `verify` SKIPPED |

**Audit findings:** 4 moderate, 3 high, **2 critical**. Earlier 12-finding observations are historical; count changed in the live advisory result, not in the locked dependency graph. `npm audit --omit=dev` is additional information **not a replacement for the required full audit**.

**Environment and verification attempts:** Portable Node 22.23.5 official Windows distribution SHA-256 `4a191082e9706866830379d577d2cc8a50c776fcd9436a8d061b063ed0d9a0e3` verified on RamonaFlowers; no global machine Node installation or project dependency changes.

**Initial transient tool/check failures, with corrections:** An initial `node -p` inline metadata one-liner had quoting errors and a separate PowerShell 5.1 `ConvertFrom-Json` attempt could not process the empty-root `packages[""]` lockfile property; these did **not** prove package invalidity. An initial Node 24 `npm ci` runner stopped when PowerShell `ErrorActionPreference=Stop` treated npm's nonfatal `allow-scripts` warning on stderr as an error. Used a separate JSON-parser verification script and explicit npm process exit-code handling, then reran **PASS** under Node 24, and ran the complete Node 22 clean-install suite **PASS**. A nonfatal `allow-scripts` warning on Node 24's `esbuild` install path is not represented as a security-audit PASS or application test failure. All failing audit checks remain disclosed without suppression.

**Implementation commits:**
- Source integration: `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041` — merge PR #5, accepted WU-0001.
- Candidate preparation commit: pending final scoped commit in this Work Unit branch; no release tag/commit on `main` is asserted.

## Formal Issues

### Scheduled Issues Addressed

- **`ASSISTANT-ISSUE-0001`** — accepted source correction Verified and merged; current Issue remains **Open / Verified** until a successor version is qualified and actually published. Already released `v0.1.2` remains affected.
- **`ASSISTANT-ISSUE-0002`** — independently tracked existing dev-tooling audit failure, **Open/U2**, remediation deferred by Owner. Fresh observations and unchanged security gate recorded; **not fixed or waived**.

### New Formal Issues Captured

- **None.** The failing audit was already captured as `ASSISTANT-ISSUE-0002` and is not duplicated. Temporary PowerShell test-launcher failures are execution observations, not independently persistent product defects.

## Corrective Findings Resolved Inside Authorized Scope

- None outside the approved WU-0001 integration and version metadata reconciliation. No new behavioral code correction was needed.

## New Ideas Captured

### Project Owner Ideas

- **None** introduced in this bounded WU.

### Assistant Ideas

- **None** introduced in this bounded WU. A future narrowly bounded release-risk exception is a decision option, not an implemented Idea/Proposal or current authorization.

## Deviations and Material Decisions

- The Owner's existing deferral of dependency maintenance was preserved. It was **not** interpreted as an audit waiver or an exception to `docs/releasing.md`.
- The `0.1.3` candidate passed full source/build/package checks, but the independent full audit blocks publication. No release security rule was silently rewritten.
- No other repository was modified. No release tag/asset was published or version identity reused.

## Known Limitations

- **Release readiness is BLOCKED.** Current OmniTurbo `docs/releasing.md` and official WA v5.7.0 `RELEASE_STANDARD.md` §4 forbid tagging/publication with a failed full required audit. 9 advisory findings remain in the locked tooling graph, including 2 critical.
- The supplemental production-only audit passed zero findings because no production dependencies are declared, but it **does not satisfy** the existing full-audit requirement.
- Candidate source/metadata remains on an **unaccepted Work Unit branch**; authoritative `main` contains the correction but is still at published package metadata `0.1.2`. No `v0.1.3` GitHub Release/npm artifact is externally available.
- GitHub CI for this version branch is **red at the existing full-audit step** on both Node 22 and Node 24: the exact dependency install PASSed and the later source/build/consumer verification was SKIPPED. [PR #6 run 44364565254](https://github.com/r146023/OmniTurbo/actions/runs/44364565254). Do not overstate source verification from CI; the full local verification passed separately.
- No acceptance-dependent serial increment or Issue closure is authorized by this report.

## Next Steps

### Project Owner Actions

**Current required action: A version-specific release-readiness disposition.** Maintaining the current full-audit release requirement leaves publication blocked until separately authorized dependency remediation and requalification. An alternative is a **distinct, explicit Owner-approved scoped risk acceptance and authorized revision to release qualification** for existing dev-tooling findings, retaining actual audit reporting, zero production-graph findings, full Node 22/24 source/package checks, and final acceptance before any publication.

This Work Unit is **Blocked / Awaiting Decision**, not Awaiting Review. `CONTINUE` alone cannot resolve a material release gate, and no `I APPROVE` acceptance is requested as though the full release objective had been achieved.

### Next Planned Work Unit

- Next: Publish an accepted, versioned OmniTurbo `v0.1.3` package **only after** the current full-audit gate passes or a separately approved, sufficiently narrow release-contract/risk disposition authorizes a modified qualification path.
- **Authorization status: Not authorized.** Any release/tag/publication is a protected, separate state transition.

## Closeout Effects if Approved

WU-0002 is currently **not fully deliverable** as a release-qualified package. Approval of a consciously bounded completed subset would preserve the remaining release blocker and must follow WA partial-closeout semantics; do not assume the accepted serial advances from `1` to `2` while the full WU remains incomplete.

If the Owner later authorizes the missing decision and full WU-0002 scope is completed and accepted under normal `I APPROVE`, its closeout would advance accepted serial exactly once, reconcile current statuses and accurately record release source/version only if actually released.

## Conclusion

Integration and technical candidate qualification are complete and reproducible. The **release security/readiness gate remains FAIL**, so WU-0002 is **Blocked / Awaiting Decision**. No `I APPROVE` closeout has occurred and acceptance-dependent project documentation remains at **Accepted Work Unit Serial 1**. No additional Work Unit, package tag, GitHub Release or external project action has been authorized.

## Project Owner scope expansion — 2026-11-18

The following Project Owner directive resolves the earlier release-gate **Blocked / Awaiting Decision** state **for bounded exception preparation only**, while preserving the prior failed audit observations as historical evidence:

```text
I ACCEPT OMNITURBO WU-0002 SCOPE EXPANSION ON RAMONAFLOWERS TO PREPARE A V0.1.3-ONLY RELEASE EXCEPTION FOR THE NINE KNOWN DEVELOPMENT-TOOLING AUDIT FINDINGS, INCLUDING TWO CRITICAL. I ACCEPT THIS VERSION-SPECIFIC RELEASE RISK, REQUIRE THE FULL AUDIT RESULTS TO REMAIN VISIBLE, AND AUTHORIZE PREPARATION OF THE CORRECTED GITHUB RELEASE. DEFER DEPENDENCY REMEDIATION. RETURN FOR MY I APPROVE BEFORE MERGE, TAG OR PUBLICATION.
```

**Effect:** Authorized / Active Work resumed, but only for a narrowly constrained, version-specific release qualification exception and the prepared future GitHub Release mechanism. The Owner expressly accepted the documented development-tooling risk **for v0.1.3 only**; WU-0002 final acceptance, integration of exception code/policy, tag creation and release publication remain **unapproved** until the next explicit `I APPROVE`.

**Scope added:** proposed update to `docs/releasing.md`; machine-checkable exact-v0.1.3-only locked-graph/known-GHSA exception policy; both full and production-only audits retained verbatim in CI/release logs and downloadable audit report assets; negative test cases for the exception; version-specific publication steps that reject overwrite of existing v0.1.3 releases and attach audit evidence/checksums.

**Exclusions preserved:** no changes to production behavior, production/runtime dependency declarations, development dependency versions, package lock graph, AVAM, the original v0.1.2 release/tag, or Owner acceptance-dependent Work Unit serial. No `v0.1.3` Git tag, GitHub Release, npm registry publication, CI changes on authoritative `main`, or new Work Unit authorization before the Owner's explicit approval.

The earlier WU-0002 blocked review above records the pre-decision state and remains evidence; this dated section is the later Owner disposition, not a retroactive rewrite of that history.

## Mandatory Owner-Facing Work Unit Review — expanded WU-0002 (2026-11-18)

### Owner decision layer

**Plain English:** The Owner-approved subscriber correction is merged into OmniTurbo `main`. A distinct, versioned `@r146023/omniturbo@0.1.3` package candidate and **v0.1.3-only audited development-tooling risk exception** have been prepared and verified, including green Node 22/24 GitHub CI, complete audit disclosures and downloadable reports. **No new release is published yet.**

**Why it matters:** The technical and controlled release pathway is ready for the required Owner acceptance. The full development-tooling audit still reports nine known findings (including two critical), but the Owner explicitly accepted this narrowly bounded v0.1.3 risk, and the prepared automation fails closed if anything material changes.

**Primary artifact:** [OmniTurbo PR #6](https://github.com/r146023/OmniTurbo/pull/6) and this [WU-0002 review](https://github.com/r146023/OmniTurbo/blob/work/wu-0002-v0.1.3-qualification/docs/project/reviews/work-units/WU-0002-V013-INTEGRATION-QUALIFICATION.md).

**Decision / next action:** **`I APPROVE`** if the Owner accepts WU-0002's release exception, qualified candidate and documented risk for subsequent controlled integration and versioned GitHub Release. This approval must be supplied **before any PR merge, tag or publication**.

**Traceability:** OmniTurbo WA v5.7.0, WU-0001 accepted and integrated in [PR #5](https://github.com/r146023/OmniTurbo/pull/5) (`32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`), WU-0002 branch `work/wu-0002-v0.1.3-qualification`, [PR #6](https://github.com/r146023/OmniTurbo/pull/6), `ASSISTANT-ISSUE-0001`, `ASSISTANT-ISSUE-0002`, [v0.1.3 release-focused Issue review](https://github.com/r146023/OmniTurbo/blob/work/wu-0002-v0.1.3-qualification/docs/project/reviews/targeted/V013-RELEASE-READINESS-0001.md).

**Work Unit:** WU-0002, integrate accepted correction, prepare/qualify v0.1.3 and prepare the explicit narrowly guarded release exception.
**Authorization:** Original exact WU-0002 `I ACCEPT` above **plus** exact subsequent Owner `I ACCEPT ... SCOPE EXPANSION` recorded in its dated addendum.
**Development Plan / Stage:** N/A — bounded maintenance/release Work Unit, no separate accepted implementation Stage.
**Result:** **Implemented and verified for Owner review**. The full audit *itself remains FAIL*; the distinct, authorized v0.1.3 exception gate passes only for the pinned findings.
**Current state:** **Awaiting Review**, no Owner acceptance-dependent closeout or serial increment yet.
**Execution window:** 2026-11-18. Precise end-to-end operational elapsed time was **not measured reliably**; none is asserted as labor or compute time.

### Summary of changes and execution results

**A. Accepted correction integration:** The approved WU-0001 code, regression tests and governance closeout were merged into `main` as PR #5 (`32b5ab8...`). The original released `v0.1.2` tag `baeb6919ec9720a9506053a4acd284a12c842b54` remains immutable. No new library runtime behavior was introduced in WU-0002.

**B. Candidate package identity:** `package.json` and the two root package-version fields in `package-lock.json` changed from `0.1.2` to `0.1.3`; all locked dependency versions remain unchanged. This version preparation originated at commit `e8215c83b6388c7fac77ff4cfeada16029118faf`. The final local temporary candidate pack (after policy script additions) is `r146023-omniturbo-0.1.3.tgz`, **53,003 bytes**, SHA-256 `e2563c5a7616872976285aedef8b0f0e7c1a8d7176eca9e33f88fc8600b24c4a`. A local nonpublishing release-asset dry run also generated and SHA-256-checked both raw audit reports and `SHA256SUMS`. This temporary tarball must be **regenerated by the approved release workflow from the accepted/tagged source**, not merely uploaded from scratch.

**C. Strict security exception:** Commit `3fb3e6d24fad48ddd9f102eda9c6b055273c8ca4` added `scripts/audit-exception-policy.mjs`, `scripts/verify-audit-gate.mjs`, `scripts/audit-exception-selftest.mjs`, amended the CI/release workflows, and prepared the public release disclosure. The gate executes and logs both complete npm security audits, pins `0.1.3`, the exact lockfile SHA-256 and approved advisory/GHSA names, guards against new/elevated risks, and requires **zero production-audit findings**. Full audit failures are plainly reported as `OWNER_ACCEPTED_EXCEPTION`, not misrepresented as `PASS`.

**D. Evidence-retention corrective:** Initial [Actions run 44373143044](https://github.com/r146023/OmniTurbo/actions/runs/44373143044) passed all code/guard/consumer checks, but GitHub's artifact uploader ignored hidden `.release-audit` files. Commit `ad46aa2a37bf3aa0b0b4da2b9b27d130f12ff14a` explicitly enabled hidden-file uploads and made missing audit artifacts an error. The resulting [GitHub Actions run 44373604315](https://github.com/r146023/OmniTurbo/actions/runs/44373604315) passed both Node 22 and Node 24 jobs with **two downloadable** security-audit artifacts. Those were independently downloaded and inspected: each artifact contains real `full.json` (11,708 bytes; nine findings, including two critical) and `production.json` (363 bytes; zero findings).

**E. Release automation preparation:** `docs/releasing.md` now proposes one explicit v0.1.3-only exception, without modifying ordinary requirements for other versions. `docs/project/releases/V0.1.3-PUBLIC-RELEASE-NOTES.md` discloses the known toolchain risk publicly. The proposed GitHub Release workflow will attach the actual full and production audit snapshots, generated installable `.tgz` and a SHA-256 manifest. It refuses to overwrite an existing `v0.1.3` release; on an authorized manual dispatch it creates the matching tag only after qualification and before Release creation. **The workflow has not been dispatched and no public release has been created.**

**Current exact qualification:**

| Check | Node 22.23.5 | Node 24.19.0 |
|---|---|---|
| Clean `npm ci` after candidate version prep | **PASS** | **PASS** |
| Full 138-test Vitest suite across 19 files | **PASS** | **PASS** |
| 14 targeted policy self-tests, including negative/fail-closed cases | **PASS** | **PASS** |
| Typecheck, build, native ESM installed-pack consumer, pack contents | **PASS** | **PASS** |
| Real full `npm audit --audit-level=high` | **FAIL — 9 known findings (2 critical)** | **FAIL — 9 known findings (2 critical)** |
| Real production-only `npm audit --omit=dev --audit-level=high` | **PASS — 0 findings** | **PASS — 0 findings** |
| Version-fingerprinted exception guard | **PASS WITH EXCEPTION**, not a passing audit | **PASS WITH EXCEPTION**, not a passing audit |
| GitHub CI PR #6 source/build/package/policy checks and downloadable reports | **PASS** — run 44373604315 | **PASS** — run 44373604315 |
| Official v0.1.3 GitHub Release workflow | **NOT RUN — Awaiting Owner `I APPROVE` and integration** | **NOT RUN — Awaiting Owner `I APPROVE` and integration** |

### Formal Issues

**Scheduled Issues addressed:** `ASSISTANT-ISSUE-0001` — generic subscriber-isolation fix accepted and integrated in current `main`; remains **Open / Verified** until qualified replacement package is actually published. `ASSISTANT-ISSUE-0002` — original dev-tooling audit findings remain **Open / U2 / deferred remediation**; only the v0.1.3 risk was explicitly accepted for proposed exception, no security dependency remediation.

**New formal Issues captured:** **None.** The artifact-retention problem was directly repaired within authorized release qualification and does not warrant a duplicate formal issue.

**Corrective Work resolved inside authorized scope:** Hidden CI audit artifacts were initially not uploaded and were fixed, verified by a subsequent successful GH Actions run and direct artifact readback. Initial one-liner PowerShell/npm execution errors and previously logged audit failure observations remain documented in the earlier WU execution ledger; no current library defect was concealed.

### New Ideas and upstream authorities

**New Project Owner Ideas:** None.
**New Assistant Ideas:** None.
**Affected owning authorities:** `docs/releasing.md` has a narrow proposed v0.1.3 exception pending Owner approval and integration; `docs/project/reviews/INDEX.md`, `docs/project/issues/assistant/ASSISTANT-ISSUE-0002.md`, `docs/project/reviews/targeted/V013-RELEASE-READINESS-0001.md` and prepared versioned release notes are reconciled in PR #6. No separate project or upstream implementation authority was changed.

### Deviations, known limitations and material decisions

- The owner expressly accepted the known nine developer-toolchain vulnerabilities for v0.1.3 only, including two critical, while keeping source/production checks and the real full audit visible. This **is not** a declaration that security advisories were fixed.
- The risk exception is strictly version-/lockfile-/GHSA-/severity-fingerprinted; a change in accepted findings, dependency graph, production advisory result or version must fail the gate and require a new bounded decision.
- No runtime dependencies were introduced; `npm audit --omit=dev` reports zero vulnerabilities. This does not guarantee absence of every possible library/security risk.
- The GH Actions run validates the candidate **CI**; the versioned release workflow has **NOT RUN**, and tag/release asset verification cannot yet be claimed. No npm-registry publication is planned.
- PR #6 remains an **unmerged candidate**; the accepted `main` source still has package metadata `0.1.2`. The public `v0.1.2` release remains immutable. No external project work occurred.
- No approval/accepted-serial state has been advanced by implementation; the current accepted WU serial remains **1**.

### Owner action and closeout effects

**Required Owner action:** Review PR #6 and this complete WU-0002 evidence. If acceptable, respond with the exact reserved WA phrase:

```text
I APPROVE
```

This accepts the qualified v0.1.3 exception and permits the **separately guarded WU-0002 integration/release finalization** only after that approval. The official release sequence must merge reviewed PR #6, verify `main` and exact version/lockfile/CI, dispatch the official v0.1.3 release workflow, ensure it actually generates the matching immutable tag and installable GitHub Release `.tgz` + both full audit reports + checksums, then verify the published artifacts. If any required gate fails or risk fingerprint changes, **stop** rather than publishing.

**Closeout effects if fully approved and finalized:** mark WU-0002 accepted/closed and increment accepted WU serial **1 → 2** exactly once, update current authority/status and relevant Issue verification/disposition only where a truly released artifact supports it. `ASSISTANT-ISSUE-0002` remains Open with separate dependency maintenance deferred. No separate implementation/release Work Unit for another project is implied.

**Next planned Work Unit:** Developer-toolchain remediation and expiry of the exception after v0.1.3 as a separately proposed, currently **Not authorized** OmniTurbo Work Unit. No other project work is authorized.

**Conclusion:** **WU-0002 Awaiting Review.** Integration of the accepted correction, candidate technical qualification and version-specific release-exception preparation are complete and proven. Full tooling audit remains failed/visible. Acceptance-dependent project-management state remains serial **1**, and no merge/tag/release of PR #6 has occurred.
