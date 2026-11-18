# OmniTurbo Project Review Index

**Project:** OmniTurbo
**Updated:** 2026-11-18
**State:** WA 5.7.0 active on `main`. WU-0001 and WU-0002 are Project Owner-approved and Closed. `v0.1.3` source and narrowly risk-accepted release were merged, published and independently verified on 2026-11-18. No active implementation Work Unit; future dependency maintenance is Not authorized.

## Current Governance Position

**Accepted Work Unit Serial:** `2` — advanced exactly once `1 → 2` for Owner-approved and completely Closed WU-0002 on 2026-11-18, following verified `v0.1.3` publication. Prior WU-0001 serial `1` retained as history.
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

- No cadence review due at accepted serial **2**; next ordinary Governance and Structure cadence at serial **3**, Integrity at **9**, subject to independent event triggers. WA 5.7.0 governance adoption remains integrated on `main`.
- **Release-focused targeted review completed and accepted for published `v0.1.3`:** `targeted/V013-RELEASE-READINESS-0001.md`. The Owner accepted a **v0.1.3-only** documented risk exception, approved WU-0002, and the official GitHub Release workflow published the corrected `.tgz` with real full/production audit JSON and SHA256SUMS. The full audit **still fails** with nine tooling findings; this is explicitly not a blanket security PASS or an exception for a later version.
- **Current Owner disposition:** WU-0001 source correction merged by PR #5 (`32b5ab8...`); WU-0002 versioned release, audit exception and governance approved by exact `I APPROVE`, merged by PR #6 (`1bead142b2219f320590c0472aee2b3a3af3c766`), and **official GitHub Release `v0.1.3` successfully published and independently verified**. Accepted serial is now **2**. Subscriber Issue `ASSISTANT-ISSUE-0001` is **Closed / Verified & Released**; tooling security Issue `ASSISTANT-ISSUE-0002` remains Open/U2 with remediation deferred. No new Work Unit authorized.

## Event-Triggered Requirements

| Trigger | Required Review | Due Before | Source / Rationale |
|---|---|---|---|
| Existing-project WA 5.7.0 onboarding | Structure Review and Integrity Audit | Material product/source modification after adoption | `STRUCTURE-0001`, `AUDIT-0001` candidate evidence |
| Material Development Plan introduced later | Governance Due Check and applicable full reviews | Plan approval/implementation as defined by WA | No current approved Development Plan identified |
| New release candidate | Release-focused Issue review and Governance Due Check | Before next release gate | `v0.1.3` review completed and owner-approved in `targeted/V013-RELEASE-READINESS-0001.md`; narrow one-version exception consumed, future versions require new normal release gate |

## Notes

- The `v0.1.2` release and pre-WA project history are preserved as history, not falsely numbered native WA Work Units.
- WA 5.7.0 adoption PR #4, accepted WU-0001 PR #5 and accepted WU-0002 PR #6 are all integrated into `main`; `v0.1.3` is tagged and published with verified assets. See `docs/project/releases/V0.1.3-RELEASE-VERIFICATION.md`.
- Corrective WU-0001: `work-units/WU-0001-SUBSCRIBER-ISOLATION.md`, Owner-approved/Closed and integrated in PR #5. WU-0002: `work-units/WU-0002-V013-INTEGRATION-QUALIFICATION.md`, **Owner-approved/Closed** following `v0.1.3` release; version-specific audit exception and release evidence in `targeted/V013-RELEASE-READINESS-0001.md` and `docs/project/releases/V0.1.3-RELEASE-VERIFICATION.md`. **Next Work Unit: Not authorized**.
