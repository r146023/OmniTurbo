# OmniTurbo v0.1.4 — Release-Focused Governance Due Check and Security Issue Review

**Date:** 2026-11-18
**Status:** Qualified normal-gate **candidate**; no release publication, acceptance or main integration authorized yet.
**Project:** OmniTurbo, Software Project Working Agreement v5.7.0
**Work Unit:** WU-0003, Owner-authorized bounded development-tooling security remediation
**Accepted baseline:** `main` `6108e21efb52280f24cb8c2a181c8c0acce7eae0`, accepted Work Unit serial **2**.

## Governance due determination

The approved WA cadence is 3 accepted Work Units for Governance/Structure and 9 for Integrity. As of this **unaccepted WU-0003** candidate, serial is **2**; no normal cadence review is due *before* completing its currently authorized work. WU-0003's **future acceptance-dependent closeout increments serial to 3**, at which point Governance and Structure Reviews become **due for subsequent protected normal progression**, per `WORK_UNIT_STANDARD.md`. Do not falsely mark those reviews complete in this WU.

The release event requires a scoped Issue review and release-focused Governance Due Check **before a tag or publication**, which this candidate record addresses. The dependency changes are development-only tooling updates and do not themselves establish a material architectural/runtime change that independently triggers a full Integrity Audit. Re-evaluate if release scope expands. A future WU-0003 Owner acceptance still does not automatically authorize another Work Unit or downstream project changes.

## Formal Issue disposition

### ASSISTANT-ISSUE-0002 — Existing dev-tooling audit failure

**Original:** On published v0.1.3's preserved locked graph the full audit produced **9 vulnerable entries: 4 moderate, 3 high, 2 critical**; the Owner narrowly accepted only that *version-specific* dev-tooling risk while preserving downloadable audits.

**Current proposed fix:** Scoped WU-0003 uses Vitest 5.1.1 and Rimraf 6.1.4, retains TypeScript 5.9.3, and re-resolves dev-only transitive packages. `npm audit --json`, `npm audit --audit-level=high`, and the production-only audit all report **0 findings** under the local `v0.1.4` candidate. Both Node 22/24 full source/build/native package suites and security-policy tests PASS. Normal release gate reports `PASS` with `fullAuditExit=0`, `productionAuditExit=0`, **no exception**.

**Current Issue state:** Open / correction implemented and locally verified **pending Owner WU-0003 acceptance and integration**; do not retroactively alter the published `v0.1.3` package or close the formal Issue solely on candidate testing.

### ASSISTANT-ISSUE-0001 — Subscriber callback isolation

Closed/Released with v0.1.3; verify preserved behavior through complete regression tests and separate fresh packed-consumer test in v0.1.4. No reopening warranted from current evidence.

## Release readiness table

| Gate | Candidate result |
|---|---|
| Published v0.1.3 preserved/tag unchanged | **PASS** |
| No new runtime dependencies and no source behavior edits | **PASS** |
| Candidate patch version identity 0.1.4/lock | **PASS** |
| Exact reproducible `npm ci`, Node 22 and 24 | **PASS** |
| Full `npm audit --audit-level=high` | **PASS, 0 findings** |
| Production-only audit | **PASS, 0 findings** |
| Normal audit gate (no exception used) | **PASS, fullAuditExit 0** |
| 138 library regression tests, 14 policy tests each runtime | **PASS** |
| Typecheck, build, packed native ESM smoke and pack check | **PASS** |
| CI checks on exact PR head | **NOT YET RUN** |
| Owner `I APPROVE` / accepted main version / release tag / published artifact | **NOT AUTHORIZED / NOT RUN** |

## Remaining gate

Complete the scoped PR, run/verify exact GitHub CI on both supported Node versions, then deliver the mandatory WA WU-0003 Owner review. Return for the Owner's `I APPROVE` **before merging the remediation PR or creating/publishing any release**.

The historic v0.1.3 exception remains version-limited; this candidate qualifies through the **normal green audit**. No dependency remediation is needed outside OmniTurbo, and no other repository is to be accessed or modified.
