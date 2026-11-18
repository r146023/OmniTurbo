# STRUCTURE-0001 — OmniTurbo WA 5.7.0 onboarding baseline

**Project:** OmniTurbo
**Date:** 2026-11-18
**Accepted WU Serial:** 0 (migration baseline; no historical WA Work Units inferred)
**Trigger:** Existing-project onboarding under published WA 5.7.0
**Overall Result:** Healthy with findings — candidate pending Owner acceptance/integration

## Review Context

- **Working Agreement:** Official `v5.7.0` immutable release, candidate adoption on `work/wa-5.7.0-adoption-0001`.
- **Authoritative product source:** `r146023/OmniTurbo` `main` `baeb6919ec9720a9506053a4acd284a12c842b54` / `v0.1.2`.
- **PROJECT_DATA:** `docs/private/PROJECT_DATA.md` on this adoption branch.
- **Evidence method:** Live GitHub branch/tag/tree inspection and scoped working-tree existence/link checks on approved RamonaFlowers machine. No source mutation/test run was performed.

## WA / Governance Structure

- [x] **PASS (candidate).** Declared `5.7.0` matches published WA tag and project-data adoption pointer, explicitly pending Owner acceptance.
- [x] **PASS.** Canonical governance Idea, Issue, Review indexes and directories exist on the candidate branch.
- [x] **PASS.** No older governance tree was reclassified as current; none identified in inspected project branches.

## Required Directories

- [x] **PASS.** `docs/private/`, `docs/project/ideas/`, `docs/project/issues/assistant/`, `docs/project/reviews/structure/`, `docs/project/reviews/integrity/` and relevant proposal/product/onboarding folders exist.
- [x] **PASS.** Product source `src/`, `tests/`, project `docs/` and package root exist.

## Authority Pointer Validation

- [x] **PASS.** `PROJECT_DATA` source pointer resolves to actual repository, branch/tag and package.
- [x] **N/A.** No independent planning-status authority or approved staged Development Plan was identified; pointer records N/A, not an invented document.
- [x] **PASS.** Product/architecture pointers to README, release docs, internal architecture, paths and implementation resolve.
- [x] **N/A.** No current GUI design baseline, Feature Ledger or OFD registry is claimed.

## Idea System

- [x] **PASS.** Idea Index exists.
- [x] **PASS.** Owner, Assistant and Legacy provenance categories are distinct; no formal records claimed.
- [x] **PASS.** No duplicate or orphaned native Idea IDs at this initial baseline.

## Issue System

- [x] **PASS.** Issue Index exists and points to `ASSISTANT-ISSUE-0001`.
- [x] **PASS.** The AVAM-specialist-discovered defect is Assistant-originated; owner support does not alter provenance.
- [x] **PASS.** Single unique native Issue ID with distinct investigation, severity, urgency, blocking, resolution, timing and closure fields.

## Review System

- [x] **PASS (candidate).** Review Index exists; initial Structure and Integrity records are included in this candidate.
- [x] **PASS.** Native Accepted Work Unit Serial starts at 0; pre-WA historical releases are not fictitiously renumbered.
- [x] **PASS.** Defaults are Governance/Structure every 3 accepted WUs, Integrity every 9; no cadence past-due claim at serial 0.
- [x] **PASS.** An issue-specific U1 resolution/timing authorization is identified separately from cadence.

## Repository / Documentation Shape

- [x] **PASS.** Current source and technical directories match the documented project structure.
- [x] **PASS with Observation.** No competing current governance authority found in inspected branches.
- [ ] **OBSERVATION (existing, non-blocking).** `README.md` links to three `docs/amber/` pages absent from current `main`; no remediation within onboarding scope.

## Internal Path Validation

- [x] **PASS.** Material canonical pointers introduced in Project Data exist in the candidate checkout.
- [x] **PASS.** `docs/releasing.md`, `src/Omni.ts`, `src/subscriptions/subscriptions.ts` and subscription tests resolve.
- [ ] **OBSERVATION.** Three old README links are broken (see findings).

## Legacy / Superseded Structures

No documented older WA governance tree found in `main`, `EnhancedManagement`, or `work/release-hardening-0001`. Do not fabricate Work Units/acceptance or rewrite pre-WA history.

## Findings

| Significance | Finding | Evidence | Follow-up |
|---|---|---|---|
| Observation | Three README links target missing `docs/amber/` files | Explicit README path existence check on `main`-based checkout | Later documentation triage if Owner prioritizes; **not** a blocker to WA adoption or subscriber correction |
| Process boundary | WA adoption is review candidate, not current `main` authority | Isolated branch starts at `baeb6919` | Owner acceptance and separate integration before claiming WA adopted |

## Issues Created

- `ASSISTANT-ISSUE-0001` — originally AVAM-discovered subscriber-isolation failure; not a finding caused by onboarding.
- No separate Issue for the non-blocking documentation observation.

## Administrative Reconciliation Performed

Created first Project Data, Questionnaire, Idea/Issue/Review and Proposal indexes without moving existing product files, reclassifying earlier records, or changing source.

## Result Notes

The candidate has a coherent initial WA 5.7.0 governance structure. The three stale README links are tracked as a non-blocking observation. This is a proposed baseline, not an Owner-approved claim that `main` is governed. The source correction awaits its own `I ACCEPT` Work Unit.
