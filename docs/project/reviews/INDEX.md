# OmniTurbo Project Review Index

**Project:** OmniTurbo
**Updated:** 2026-11-18
**State:** Initial WA 5.7.0 governance baseline authorized by the Project Owner; effective on `main` upon integration of governance PR #4.

## Current Governance Position

**Accepted Work Unit Serial:** `1` — Owner-approved WU-0001 closed on 2026-11-18; earlier native baseline serial was 0.
**Serial Baseline:** 2026-11-18 Owner-authorized WA 5.7.0 existing-project onboarding; native serial 0.
**Baseline Evidence:** `docs/project/onboarding/WA-5.7.0-ADOPTION-0001.md`, `structure/STRUCTURE-0001.md`, `integrity/AUDIT-0001.md`.

### Last Governance Review

- **Record:** N/A — no separate Governance Review performed at onboarding
- **Date:** N/A
- **Accepted WU Serial:** N/A

### Last Structure Review

- **Record:** `structure/STRUCTURE-0001.md` — proposed baseline
- **Date:** 2026-11-18
- **Accepted WU Serial:** 0

### Last Integrity Audit

- **Record:** `integrity/AUDIT-0001.md` — proposed baseline
- **Date:** 2026-11-18
- **Accepted WU Serial:** 0

## Cadence

- **Governance interval:** 3 accepted Work Units
- **Structure interval:** 3 accepted Work Units
- **Integrity interval:** 9 accepted Work Units
- **Project-specific override:** None

## Currently Due

- No cadence review due at accepted serial 1; next ordinary Governance and Structure cadence is serial 3, Integrity at serial 9 (subject to independent event triggers). WA 5.7.0 adoption PR #4 is already integrated on `main`.
- **Current Owner disposition:** WU-0001's corrected observer-isolation implementation was **approved and closed** on 2026-11-18, advancing accepted serial 0 -> 1. `ASSISTANT-ISSUE-0001` has a Verified corrected candidate but remains Open because PR #5 is unmerged and the published v0.1.2 package is still affected. `ASSISTANT-ISSUE-0002` remains Open at U2 with dependency remediation deferred; red audit findings must still be reported at any separately authorized release gate.

## Event-Triggered Requirements

| Trigger | Required Review | Due Before | Source / Rationale |
|---|---|---|---|
| Existing-project WA 5.7.0 onboarding | Structure Review and Integrity Audit | Material product/source modification after adoption | `STRUCTURE-0001`, `AUDIT-0001` candidate evidence |
| Material Development Plan introduced later | Governance Due Check and applicable full reviews | Plan approval/implementation as defined by WA | No current approved Development Plan identified |
| New release candidate | Release-focused Issue review and Governance Due Check | Release gate | `docs/releasing.md` and WA `RELEASE_STANDARD.md` |

## Notes

- The `v0.1.2` release and pre-WA project history are preserved as history, not falsely numbered native WA Work Units.
- WA 5.7.0 adoption PR #4 is integrated into `main`; WU-0001 closeout is recorded on the unmerged correction branch, not yet integrated into `main`.
- Corrective WU-0001: `work-units/WU-0001-SUBSCRIBER-ISOLATION.md` (Owner-authorized and **Project Owner-approved / Closed** 2026-11-18; PR #5 remains Open). No new Work Unit is authorized; code integration, package release and AVAM dependency work remain separate gates.
