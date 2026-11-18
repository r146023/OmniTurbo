# ASSISTANT-ISSUE-0001 — Post-commit subscriber exception escapes a successful write

**ID:** `ASSISTANT-ISSUE-0001`
**Origin:** Planning and Development Assistant (AVAM specialist discovery)
**Type:** Defect
**Investigation State:** Confirmed by recorded AVAM native-fit evidence and independent upstream source inspection
**Severity:** High
**Urgency:** U1 at report; **Closed** after verified corrected OmniTurbo `v0.1.3` publication.
**Blocks:** Historical pre-fix package consumers, including the originally reported native-fit contract. **Resolved in published OmniTurbo `v0.1.3`.** No other project's current readiness is asserted.
**Closure State:** Closed
**Closure Reason:** Verified synchronous subscriber exception isolation implemented by Owner-approved WU-0001, merged in PR #5 and published in qualified GitHub Release `v0.1.3` on 2026-11-18 (tag `1bead142b2219f320590c0472aee2b3a3af3c766`). Published installable tarball independently downloaded and tested; `v0.1.2` remains historically affected.
**Reported:** 2026-11-17 (AVAM evidence), presented for OmniTurbo correction 2026-11-18
**Last Reviewed:** 2026-11-18 — WU-0002 Owner acceptance, published v0.1.3 verification and formal Issue closeout
**Next Review Trigger:** None while Closed. Reopen only on new supported regression evidence in an actually qualified successor version; the old `v0.1.2` defect remains historical and unchanged.
**Affected Versions / Stages:** `@r146023/omniturbo@0.1.2` / `v0.1.2` (`baeb6919ec9720a9506053a4acd284a12c842b54`)
**Environment:** TypeScript/Node package used by AVAM on isolated S02-P1 branch; upstream code inspected on current OmniTurbo `main`

## Original Report

The AVAM specialist demonstrated that a subscribed callback throwing synchronously **after a successful state commit** escapes the originating protected setter. A subsequent eligible subscriber is skipped and the writer does not receive its truthful `OmniResult` response. The Project Owner supplied this evidence and requested a bounded upstream OmniTurbo correction.

This record reconstructs the AVAM-specialist-originated report from the evidence; it does not claim a verbatim original Owner report or retroactive WA issue history.

## Current Understanding

In `src/Omni.ts`, `_setInternal()` commits the value, then invokes `subscriptions.notify()`, then returns `okResult()`. The registry in `src/subscriptions/subscriptions.ts` invokes individual direct/global/tree/parent callbacks without exception isolation. A synchronous callback throw therefore stops notification and prevents a successful committed write from returning normally.

## Observed Behavior

- Value already committed.
- First direct subscriber throws.
- Throw escapes private setter.
- Later eligible subscriber is not notified.
- No structured `OmniResult.success === true` reaches the caller.

AVAM's 2026-11-17 native-fit run recorded **2 pass, 1 fail**; the intentionally failing contract test asserts the desired corrected behavior. A separate passing observation test confirms the bad committed-but-throwing behavior.

## Expected Behavior

The public writer receives a successful structured result for an already committed update, regardless of a synchronous post-commit subscription callback failure. Every other eligible subscriber is still attempted, preserving established subscription ordering and lifecycle semantics. Invalid/unauthorized pre-commit writes still reject without publication.

## Reproduction

1. Create `Omni` with a private protected setter for a path.
2. Subscribe twice on that path, first callback throwing, second recording the update.
3. Invoke the authorized setter with a different valid value.
4. Compare the committed stored value, callback delivery and returned write result against the expected contract.

## Evidence

- AVAM reproduction: [v7-s02-p1-omniturbo-native-fit.test.mjs](https://github.com/r146023/AV9X_Architectural_Model/blob/work/avam-v7-s02-p1-thing-scoped-omni/packages/runtime-core/scripts/qualification/v7-s02-p1-omniturbo-native-fit.test.mjs)
- AVAM evidence: [native-fit README](https://github.com/r146023/AV9X_Architectural_Model/blob/work/avam-v7-s02-p1-thing-scoped-omni/reference/implementation-evidence/0036-avam-v7-s02-p1-omniturbo-native-fit/README.md)
- AVAM upstream proposal: [OMNITURBO-SUBSCRIBER-FAILURE-UPSTREAM-PROPOSAL-0001](https://github.com/r146023/AV9X_Architectural_Model/blob/work/avam-v7-s02-p1-thing-scoped-omni/docs/project/reviews/targeted/OMNITURBO-SUBSCRIBER-FAILURE-UPSTREAM-PROPOSAL-0001.md)
- Upstream `src/Omni.ts`, `src/subscriptions/subscriptions.ts`, `tests/omni/subscriptions.test.ts` at `v0.1.2`.
- No new OmniTurbo runtime test was executed in the governance-adoption task; original reproduction evidence is external to this candidate branch.

## Impact

A mutation is committed while its caller receives an exception, creating false transaction semantics and potentially suppressing downstream listeners. AVAM's S02-P1 native projection binding cannot establish its required truthful-write/observer-isolation contract against the current package.

## Root Cause

Synchronous post-commit callbacks are invoked without per-subscriber exception isolation, and `okResult()` is built after notification returns.

## Resolution

### Resolution State

`Verified / Released` — WU-0001 fix was Owner-approved, integrated into `main` as PR #5 and published in `v0.1.3` following separate WU-0002 Owner acceptance and controlled version-specific security-risk exception. The real installed GitHub tarball was independently verified; `v0.1.2` remains the historically affected artifact.

### Proposed Resolution

- Isolate synchronous exceptions **per subscriber callback** at `SubscriptionRegistry.notify()`, preserving other eligible listeners and established direct/global/tree/parent behavior.
- Record sanitized observer warnings in the **existing** `OmniResult.issues` (`source: subscription`) without changing `success: true`, `changed: true` or `rejected: false` for a committed mutation.
- Preserve once/unsubscribe semantics and treat a throwing once/throttled callback as an attempted invocation.
- Cover private setters, all notification categories, undo and batch notification paths, no-notify failed writes, and packed-consumer behavior.
- Preserve pre-commit validators/coercers/privacy rejection; exclude asynchronous Promise rejection supervision, broad diagnostics systems, AVAM source changes and unrelated refactors.
- Qualify the candidate with existing npm verification and fresh consumer checks; keep `v0.1.2` immutable and release separately only with authorization.

### Approved Resolution

Owner-approved bounded correction: isolate synchronous post-commit subscriber callback failures individually; return truthful structured success and sanitized subscription warnings without halting eligible listeners; preserve direct/global/tree/parent, once/unsubscribe/throttle, private setter/token security, validation/coercion, undo and batch semantics. Qualify via native tests and packed consumer. Exclude broad diagnostics/async rejection supervision, dependency upgrades, AVAM changes and publication.

### Resolution Decision Evidence

2026-11-18 exact Owner directive: `I APPROVE OMNITURBO ASSISTANT-ISSUE-0001 RESOLUTION AND TIMING; I ACCEPT THE BOUNDED OMNITURBO SUBSCRIBER-ISOLATION CORRECTION ON RAMONAFLOWERS`. WU-0001 owns the active execution envelope.

## Timing

### Timing State

`Timing Approved`

### Proposed Timing

After WA 5.7.0 onboarding is accepted and integrated, prioritize this one corrective Work Unit before resuming blocked AVAM S02-P1 native-fit work.

### Approved Timing

Immediately after OmniTurbo's WA 5.7.0 adoption and before AVAM S02-P1 native-fit resumes. Implementation authorized now in WU-0001 on RamonaFlowers; no package release, downstream AVAM dependency update, or additional Work Unit implied.

### Timing Decision Evidence

2026-11-18 Owner directive quoted under Resolution Decision Evidence and WU-0001 record.

## Verification Requirements

- Repeat original native-fit failure on unmodified v0.1.2 then pass on corrected candidate.
- All eligible subscribers attempted even if one synchronously throws; truthful `OmniResult` success retained.
- Direct/tree/global/parent, once/unsubscribe/throttle, undo and batch behavior retained.
- Invalid/unauthorized writes are neither committed nor published.
- Independent private roots and cross-root token rejection retained.
- Existing coercion, alerts, waiters, package exports, typecheck, full tests and Node-supported qualification remain compatible.
- Fresh packed `@r146023/omniturbo` consumer proves public API behavior.

## Implementation / Verification Evidence

Project Owner-approved WU-0001 on branch `work/subscriber-isolation-0001` / [PR #5](https://github.com/r146023/OmniTurbo/pull/5). Implementation commit `921c4c9c6f95a6612bade470fbab6a83a797853f`; Owner review evidence commit `eaba649db1c7d52cda578c10f837e263068d69e1`. `npm run verify` passed on Node 24: 138/138 tests, typecheck/build, fresh installed-package consumer and pack check. Two desired AVAM native-fit contracts passed against the corrected candidate tarball. GitHub CI Node 22/24 remains blocked by the pre-existing dependency audit (`ASSISTANT-ISSUE-0002`); this is not a claim of full release qualification. No `v0.1.2` tag, GitHub Release, AVAM dependency or main-branch source changes authorized by WU-0001.

## Related Authorities and Work Units

- `docs/project/onboarding/WA-5.7.0-ADOPTION-0001.md` (governance-only)
- AVAM WU-0024 / S02-P1 evidence, distinct from any future OmniTurbo Work Unit.

## Review History

- `docs/project/reviews/integrity/AUDIT-0001.md` — initial onboarding discovery record.
- `docs/project/reviews/work-units/WU-0001-SUBSCRIBER-ISOLATION.md` — owner-accepted corrective Work Unit, closed 2026-11-18 and integrated through PR #5. Issue remains Open pending successor release/qualification.
- `docs/project/reviews/work-units/WU-0002-V013-INTEGRATION-QUALIFICATION.md` — Owner-approved/Closed WU-0002 and verified v0.1.3 published package; formal release evidence in `docs/project/releases/V0.1.3-RELEASE-VERIFICATION.md`.

## Current Decision Summary

**Closed / Verified and Released (2026-11-18).** Owner-approved WU-0001 subscriber correction was merged in PR #5; Owner-approved WU-0002 v0.1.3 risk-accepted release process merged in PR #6 and successfully published as [OmniTurbo v0.1.3](https://github.com/r146023/OmniTurbo/releases/tag/v0.1.3). The official GitHub tarball is a tested, installable package containing the corrected behavior. The old v0.1.2 remains immutable and affected; the unrelated dev-tooling audit Issue `ASSISTANT-ISSUE-0002` stays Open/deferred and is not silently resolved.
