# OmniTurbo Project Review Index

**Project:** OmniTurbo
**Updated:** 2026-11-18
**State:** WA 5.7.0 active on `main`. WU-0001, WU-0002 and **WU-0003 are Project Owner-approved / Closed**. `v0.1.4` is the latest published package, with true full/production audit PASS (zero findings), checksum and fresh package verification. **Accepted WU serial 3; Governance and Structure Reviews now DUE before further protected normal progression**. No new Work Unit authorized.

## Current Governance Position

**Accepted Work Unit Serial:** `3` — advanced exactly once `2 → 3` for Owner-approved/Closed WU-0003, after official `v0.1.4` source acceptance, publication and independent verification on 2026-11-18. WU-0001 serial `1` and WU-0002 serial `2` remain historical.
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

- **DUE NOW at accepted WU serial 3:** Ordinary **Governance Review and Structure Review**, both not yet performed. They must be completed at their own protected review gate before another normal governed progression. The next normal Integrity cadence remains **9** (unless separately event-triggered). Do **not** mark the Governance/Structure Reviews complete merely because WU-0003 closed.
- **Release-focused targeted review completed and accepted for published `v0.1.3`:** `targeted/V013-RELEASE-READINESS-0001.md`. The Owner accepted a **v0.1.3-only** documented risk exception, approved WU-0002, and the official GitHub Release workflow published the corrected `.tgz` with real full/production audit JSON and SHA256SUMS. The full audit **still fails** with nine tooling findings; this is explicitly not a blanket security PASS or an exception for a later version.
- **Current Owner disposition:** WU-0003 received exact `I APPROVE`, the reviewed remediation PR #8 merged to `main` at `94769f173828cc622628c7b2889cd94d60e902ac`, and [official `v0.1.4` Release](https://github.com/r146023/OmniTurbo/releases/tag/v0.1.4) published with actual zero-finding full/production audit JSON, verified checksums and a fresh installed native-ESM consumer PASS. Accepted serial is **3**; `ASSISTANT-ISSUE-0001` and `ASSISTANT-ISSUE-0002` are both **Closed**. `v0.1.3` remains historically immutable with its earlier one-version exception; no new Work Unit authorized.

## Event-Triggered Requirements

| Trigger | Required Review | Due Before | Source / Rationale |
|---|---|---|---|
| Existing-project WA 5.7.0 onboarding | Structure Review and Integrity Audit | Material product/source modification after adoption | `STRUCTURE-0001`, `AUDIT-0001` candidate evidence |
| Material Development Plan introduced later | Governance Due Check and applicable full reviews | Plan approval/implementation as defined by WA | No current approved Development Plan identified |
| New release candidate | Release-focused Issue review and Governance Due Check | Before future release gate | `v0.1.4` normal-gate release-focused check performed and reviewed in `targeted/V014-RELEASE-READINESS-0001.md`. Official release published with full audit truly PASS/zero and no risk exception. Other versions remain subject to normal release requirements. |

## Notes

- The `v0.1.2` release and pre-WA project history are preserved as history, not falsely numbered native WA Work Units.
- WA 5.7.0 adoption PR #4, accepted WU-0001 PR #5, WU-0002 PR #6, release-closeout PR #7, and accepted WU-0003 PR #8 are integrated into `main`. `v0.1.4` is tagged/published and its official release assets verified; `v0.1.3` is preserved. WU-0003 closeout records will be propagated through their separate post-release governance PR.
- Corrective WU-0001: `work-units/WU-0001-SUBSCRIBER-ISOLATION.md`, Owner-approved/Closed. WU-0002: `work-units/WU-0002-V013-INTEGRATION-QUALIFICATION.md`, Owner-approved/Closed, published `v0.1.3`. WU-0003: `work-units/WU-0003-DEVTOOL-SECURITY-REMEDIATION.md`, **Owner-approved/Closed**, published normal-gate `v0.1.4` and resolved `ASSISTANT-ISSUE-0002`. See `docs/project/releases/V0.1.4-RELEASE-VERIFICATION.md`. Governance/Structure Reviews **DUE** at serial 3; next Work Unit **Not authorized**.
