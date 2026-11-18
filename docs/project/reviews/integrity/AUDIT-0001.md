# AUDIT-0001 — OmniTurbo existing-project WA 5.7.0 integrity baseline

**Project:** OmniTurbo
**Date:** 2026-11-18
**Accepted WU Serial:** 0 (new native-WA baseline)
**Trigger:** Existing-project onboarding / major governance authority transition
**Overall Result:** Findings require follow-up — governance baseline usable after Owner acceptance; no material source-work integrity blocker identified in scoped checks

## Audit Context and Scope

Assess whether the published OmniTurbo source/release and new WA 5.7.0 administrative authorities can be navigated coherently without rewriting existing work or falsely claiming historical WA compliance. This **is not** a full security review, new source qualification, or acceptance of the proposed subscriber repair. The adoption candidate must be accepted/integrated before claiming that `main` is governed by 5.7.0.

## Sources Examined

- `r146023/OmniTurbo` `main` at `baeb6919ec9720a9506053a4acd284a12c842b54`, package metadata, current `v0.1.2` release/tag, root README, `docs/` structure, relevant API/side-effect/release documentation, `src/Omni.ts`, `src/subscriptions/subscriptions.ts`, and subscription tests.
- Inspected branch trees: `main`, `EnhancedManagement`, `work/release-hardening-0001`; existing open PR is unrelated Dependabot tooling maintenance.
- `r146023/ProjectWorkingAgreement` published `v5.7.0` pack, `README_FIRST`, `WORKFLOW`, `PROJECT_DATA_STANDARD`, `MIGRATION_NOTES`, governance standards and templates.
- AVAM S02-P1 `v0.1.2` native-fit reproduction, documented evidence, and bounded upstream proposal on `work/avam-v7-s02-p1-thing-scoped-omni`.
- Local candidate Project Data, Questionnaire, Idea/Issue/Proposal/Review indexes, onboarding record and `STRUCTURE-0001` created under approved RamonaFlowers scoped checkout.
- No fresh `npm test`, `npm run verify`, or runtime reproduction was executed in this *governance* review. Release/AVAM test findings are historical external evidence.

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

## Issues Created

### Project Owner-originated
None.

### Assistant-originated
- `ASSISTANT-ISSUE-0001` — v0.1.2 post-commit subscriber failure.

## Assistant Ideas Created

None.

## Administrative Reconciliation Performed

Introduced new WA 5.7.0 governance navigation and native serial baseline with historical non-retroactivity, current source pointers, setup applicability pass, governance indexes and initial reviews.

## Unresolved Authority Questions

- Owner acceptance/integration of governance adoption still outstanding.
- No currently authorized OmniTurbo subscriber-correction Work Unit; Issue direction has been discussed, but implementation must receive its own `I ACCEPT`.
- Future business/platform scope remains Undecided and is not material to this bounded correction.

## Audit Result

**Initial integrity baseline complete as a review candidate.** Current project source/release history and new governance records are distinguishable, canonical pointers are coherent, and no material structural contradiction was found in the scoped checks. The pre-existing broken documentation links and subscriber defect are explicitly tracked without opportunistic code work. Do not claim governance adoption, corrective success, or release approval until their separate Owner gates are satisfied.
