# OmniTurbo Project Review Index

**Project:** OmniTurbo
**Updated:** 2026-11-18
**State:** WA 5.7.0 active on `main`. WU-0001 approved/closed at serial 1 and integrated. WU-0002's Owner-authorized `v0.1.3`-only security-risk exception and candidate qualification are implemented and **Awaiting Review**; not accepted, merged, tagged or published.

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
- **Release-focused targeted review completed for the `v0.1.3` candidate:** `targeted/V013-RELEASE-READINESS-0001.md`. The full development-tooling audit remains FAIL, with a separately Owner-risk-accepted, tightly scoped candidate exception. The version-specific CI and evidence checks pass, but WU-0002 remains **Awaiting Review** and no release/tag/publication is permitted until explicit `I APPROVE` and integration. This is not a cadence review or a release approval.
- **Current Owner disposition:** Accepted WU-0001 integrated to `main` by PR #5 at `32b5ab8bb7d8e5502681dec8cb2ee17aa1c70041`; accepted serial remains **1**. Under a separate explicit scope expansion, the Owner accepted the **nine known dev-tooling findings (two critical) for v0.1.3 only**, requiring a visible full audit and separate final `I APPROVE` before merge, tag or release. WU-0002's proposed exception passes real guarded audits and full Node 22/24 CI on PR #6 and is **Awaiting Review**, not accepted. `ASSISTANT-ISSUE-0001` remains Open/Verified pending successor release; `ASSISTANT-ISSUE-0002` remains Open/U2, dependency remediation deferred. No release/tag exists.

## Event-Triggered Requirements

| Trigger | Required Review | Due Before | Source / Rationale |
|---|---|---|---|
| Existing-project WA 5.7.0 onboarding | Structure Review and Integrity Audit | Material product/source modification after adoption | `STRUCTURE-0001`, `AUDIT-0001` candidate evidence |
| Material Development Plan introduced later | Governance Due Check and applicable full reviews | Plan approval/implementation as defined by WA | No current approved Development Plan identified |
| New release candidate | Release-focused Issue review and Governance Due Check | Release gate | Scoped check documented in `targeted/V013-RELEASE-READINESS-0001.md`; proposed `v0.1.3`-only audited exception qualified in CI, pending WU-0002 Owner acceptance and integration under `docs/releasing.md` and WA `RELEASE_STANDARD.md` |

## Notes

- The `v0.1.2` release and pre-WA project history are preserved as history, not falsely numbered native WA Work Units.
- WA 5.7.0 adoption PR #4 and accepted WU-0001 source/closeout PR #5 are both integrated into `main`. WU-0002 version preparation and local qualification are in their own unaccepted branch.
- Corrective WU-0001: `work-units/WU-0001-SUBSCRIBER-ISOLATION.md`, Owner-approved/Closed and integrated in PR #5. Current WU-0002: `work-units/WU-0002-V013-INTEGRATION-QUALIFICATION.md`, **Awaiting Review** of the v0.1.3-only audited exception (PR #6). Release-focused Issue review and Owner risk decision: `targeted/V013-RELEASE-READINESS-0001.md`. No WU-0002 `I APPROVE`, `v0.1.3` tag or publication.
