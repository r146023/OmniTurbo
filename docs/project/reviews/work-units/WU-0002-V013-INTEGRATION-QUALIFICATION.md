# WU-0002 — Integrate Accepted Subscriber Correction and Qualify v0.1.3

**Project:** OmniTurbo
**Governing Working Agreement:** v5.7.0, immutable official release
**Current Work Unit State:** Blocked / Awaiting Decision at the versioned release-readiness security-audit gate; completed integration and candidate qualification are reviewable, but WU-0002 is not yet accepted.
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
| Normal green GitHub Actions / full release contract | **NOT ESTABLISHED** — full audit blocks release readiness | **NOT ESTABLISHED** — full audit blocks release readiness |

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
- GitHub CI for this version branch will still be red at the existing full-audit step until applicable Owner-authorized resolution. Do not overstate source CI verification.
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
