# AUDIT-0001 — OmniTurbo existing-project WA 5.7.0 integrity baseline

**Project:** OmniTurbo
**Date:** 2026-11-18
**Accepted WU Serial:** 0 (new native-WA baseline)
**Trigger:** Existing-project onboarding / major governance authority transition
**Overall Result:** Dependent work blocked — the existing dependency-audit CI gate fails on Node 22/24; governance-only candidate remains reviewable, with separate Owner disposition required

## Audit Context and Scope

Assess whether the published OmniTurbo source/release and new WA 5.7.0 administrative authorities can be navigated coherently without rewriting existing work or falsely claiming historical WA compliance. This **is not** a full security review, new source qualification, or acceptance of the proposed subscriber repair. The adoption candidate must be accepted/integrated before claiming that `main` is governed by 5.7.0.

## Sources Examined

- `r146023/OmniTurbo` `main` at `baeb6919ec9720a9506053a4acd284a12c842b54`, package metadata, current `v0.1.2` release/tag, root README, `docs/` structure, relevant API/side-effect/release documentation, `src/Omni.ts`, `src/subscriptions/subscriptions.ts`, and subscription tests.
- Inspected branch trees: `main`, `EnhancedManagement`, `work/release-hardening-0001`; existing open PR is unrelated Dependabot tooling maintenance.
- `r146023/ProjectWorkingAgreement` published `v5.7.0` pack, `README_FIRST`, `WORKFLOW`, `PROJECT_DATA_STANDARD`, `MIGRATION_NOTES`, governance standards and templates.
- AVAM S02-P1 `v0.1.2` native-fit reproduction, documented evidence, and bounded upstream proposal on `work/avam-v7-s02-p1-thing-scoped-omni`.
- Local candidate Project Data, Questionnaire, Idea/Issue/Proposal/Review indexes, onboarding record and `STRUCTURE-0001` created under approved RamonaFlowers scoped checkout.
- No fresh local `npm test`, `npm run verify`, or runtime reproduction was executed in this *governance* review. Release/AVAM test findings are historical external evidence.
- After PR #4 publication, GitHub Actions push run [44333869612](https://github.com/r146023/OmniTurbo/actions/runs/44333869612) and PR run [44334008009](https://github.com/r146023/OmniTurbo/actions/runs/44334008009) both failed audit on Node 22/24; dependency install passed and build/tests were skipped.

## Structural Baseline

`docs/project/reviews/structure/STRUCTURE-0001.md` performs the required independent structure checks. Current pointers, directories, IDs and native serial baseline are coherent on the adoption branch. One documentation observation exists (three missing README-linked `docs/amber/` pages).

## Authority Integrity

- `main` remains the product source of truth at historical `v0.1.2` HEAD; new governance is explicitly candidate and cannot claim adopted `main` authority yet.
- No older canonical WA Project Data, active Work Unit, approval or development plan found in inspected branch trees. No retroactive native-WA records invented.
- No competing current project governance tree identified.
- New Project Data points to existing product/technical source and owned governance records; N/A fields avoid invented approvals.

## Product / Design Consistency

- Existing README defines a governed path-state library and public structured-result contract consistent with current package identity.
- No approved GUI design authority exists or is claimed; N/A is appropriate for API-only project maintenance.
- No new product scope or AVAM-specific Thing/Strata contracts are introduced in migration.
- The AVAM-driven desired subscriber isolation is **proposed corrective behavior**, not misrepresented as existing v0.1.2 behavior.

## Architecture Consistency

- Source confirms `_setInternal()` commits before `subscriptions.notify()`; registry callbacks currently lack per-subscriber exception isolation.
- This matches the AVAM recorded failure; original source is unchanged here.
- `package.json` supports `@r146023/omniturbo@0.1.2` on Node `>=22`; current `docs/releasing.md` expects Node 22/24 CI and a packed native-ESM consumer check.

## Development Plan Integrity

- No formal approved OmniTurbo Development Plan found in current repository; no plan or roadmap fabricated during migration.
- The first proposed next work is Issue-driven, not an invented stage. A separate `I ACCEPT` and Issue resolution/timing authority are still needed before modifying source.
- Release readiness still requires separate authorization, qualification, acceptance and release gates.

## Implementation / Documentation Consistency

- Existing subscription tests cover ordinary direct/tree/global, unsubscribe, global once, parent notifications and coercion; they do **not** prove throwing-listener isolation.
- AVAM's native test documents the actual v0.1.2 gap; it is not falsely reported as passing.
- The README has three broken links into missing `docs/amber/` files. This is a non-blocking pre-existing documentation inconsistency; do not repair it as unapproved scope.
- CI's existing `npm audit --audit-level=high` fails with 12 advisories (4 moderate, 6 high, 2 critical), involving the unchanged development-tooling lockfile; no fresh CI build/test success exists for this candidate. This finding is tracked separately as `ASSISTANT-ISSUE-0002`.
- No fresh runtime test suite was run in this onboarding; all current qualification claims refer to existing evidence only.

## Governance Integrity

- New Idea Index starts empty rather than backfilling unsupported origins.
- `ASSISTANT-ISSUE-0001` records the upstream bug using the AVAM specialist's discovery provenance, not Owner origin.
- Resolution/timing are Proposed with Owner support noted, not falsely treated as an authorized Work Unit.
- Proposal applicability is checked at setup; relevant-but-inactive Candidate proposals have no active Trial; Formative Experiment participation is N/A.
- Initial WU Serial 0, baseline reviews, and cadence bookkeeping are coherent and prospective.

## Migration Integrity

- WA 5.7.0 is an existing-project adoption from **no previously verified formal WA**, not an invented direct migration from a presumed v5.x baseline.
- The published `v5.7.0` tag/release is independently verified.
- Existing accepted source/release evidence remains untouched and is not rewritten to pretend past work occurred under WA 5.7.0.
- Onboarding only establishes administrative artifacts; source implementation and release are explicitly excluded.

## Process-Evidence Integrity

- Existing v0.1.2 release and tag are verifiable; earlier Owner acceptance evidence was not reconstructed as v5 Work Units.
- No self-approval, merge, release or AVAM dependency update is claimed.
- Both Node 22 and 24 CI checks are red on the governance PR due to existing dependency audit findings; the untouched `package-lock.json` has the same blob SHA (`a6cabee23959d18708d2f383c14af6a4f7957045`) on baseline and candidate. The failed checks must not be interpreted as a verified fix regression, but neither may they be described as passing.
- The next protected transitions are Owner acceptance of this adoption candidate and a **separate** source-modifying Work Unit authorization for subscriber isolation.

## Stale / Missing / Contradictory Information

- Three README `docs/amber/` links resolve to absent paths; document the observation without broad cleanup.
- No authoritative formal product roadmap/Feature Ledger or historical WA Work Unit log identified; explicitly `N/A` or unknown rather than an invalid claim.
- Long-term business and platform commitments remain Undecided in the Questionnaire.

## Findings Summary

| Significance | Finding | Evidence | Blocks | Follow-up |
|---|---|---|---|---|
| Observation | Three stale README links to missing Amber docs | GitHub tree/local path checks | No — not adoption or subscriber-correction blocker | Later bounded documentation triage if selected |
| Process boundary | Adoption candidate awaiting Owner acceptance/integration | Current `main` and isolated branch | **Yes — claiming WA already authoritative on main** | Owner review of governance-only branch before integrating |
| Known defect (tracked Issue) | Throwing subscriber can interrupt completed mutation delivery | AVAM recorded failing native-fit proof + upstream source inspection | Yes — AVAM S02-P1 native fit | `ASSISTANT-ISSUE-0001`, later bounded corrective WU |
| Major — separate infrastructure/CI issue | Existing dependency audit reports 12 advisories and fails both supported CI Node versions | PR #4 Actions push/PR runs; unchanged dependency lockfile | Yes — normal green-CI/release qualification, Owner must decide governance-only PR treatment | `ASSISTANT-ISSUE-0002`, separate tooling remediation decision |

## Issues Created

### Project Owner-originated
None.

### Assistant-originated
- `ASSISTANT-ISSUE-0001` — v0.1.2 post-commit subscriber failure.
- `ASSISTANT-ISSUE-0002` — pre-existing development dependency-audit CI gate failure on Node 22/24.

## Assistant Ideas Created

None.

## Administrative Reconciliation Performed

Introduced new WA 5.7.0 governance navigation and native serial baseline with historical non-retroactivity, current source pointers, setup applicability pass, governance indexes and initial reviews.

## Unresolved Authority Questions

- Owner acceptance/integration of governance adoption still outstanding.
- No currently authorized OmniTurbo subscriber-correction Work Unit; Issue direction has been discussed, but implementation must receive its own `I ACCEPT`.
- Owner disposition is required on governance-only PR #4 under red, demonstrably pre-existing CI checks; a separate dependency maintenance authorization must precede any package graph or CI workflow modification.
- Future business/platform scope remains Undecided and is not material to this bounded correction.

## Audit Result

**Initial integrity baseline complete as a review candidate, with a dependent CI gate blocker.** Project source/release history and new governance records are distinguishable, canonical pointers are coherent, and no material structural contradiction was found in scoped checks. The three pre-existing broken documentation links, subscriber defect, and red dependency-audit CI gate are identified without opportunistic code work. The governance-only adoption branch requires explicit Owner disposition; future source/package release qualification must pass the applicable full CI contract or receive a separately governed decision. Do not claim governance adoption, corrective success, or release approval until their distinct Owner gates are satisfied.
