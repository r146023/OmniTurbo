# ASSISTANT-ISSUE-0001 — Post-commit subscriber exception escapes a successful write

**ID:** `ASSISTANT-ISSUE-0001`
**Origin:** Planning and Development Assistant (AVAM specialist discovery)
**Type:** Defect
**Investigation State:** Confirmed by recorded AVAM native-fit evidence and independent upstream source inspection
**Severity:** High
**Urgency:** U1 — review before dependent AVAM integration work
**Blocks:** AVAM V7 S02-P1 native OmniTurbo fit gate (AVAM WU-0024)
**Closure State:** Open
**Closure Reason:** N/A
**Reported:** 2026-11-17 (AVAM evidence), presented for OmniTurbo correction 2026-11-18
**Last Reviewed:** 2026-11-18 onboarding baseline
**Next Review Trigger:** Owner decision on exact bounded corrective Work Unit and verified qualification result
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

`Resolution Proposed` — substantive direction endorsed by Owner, separate WA Work Unit authorization still pending.

### Proposed Resolution

- Isolate synchronous exceptions **per subscriber callback** at `SubscriptionRegistry.notify()`, preserving other eligible listeners and established direct/global/tree/parent behavior.
- Record sanitized observer warnings in the **existing** `OmniResult.issues` (`source: subscription`) without changing `success: true`, `changed: true` or `rejected: false` for a committed mutation.
- Preserve once/unsubscribe semantics and treat a throwing once/throttled callback as an attempted invocation.
- Cover private setters, all notification categories, undo and batch notification paths, no-notify failed writes, and packed-consumer behavior.
- Preserve pre-commit validators/coercers/privacy rejection; exclude asynchronous Promise rejection supervision, broad diagnostics systems, AVAM source changes and unrelated refactors.
- Qualify the candidate with existing npm verification and fresh consumer checks; keep `v0.1.2` immutable and release separately only with authorization.

### Approved Resolution

N/A as a formal WA issue decision. Project Owner expressed agreement with the correction and refinements during pre-adoption discussion; no source-modifying Work Unit was yet activated.

### Resolution Decision Evidence

2026-11-18 Owner conversation accepted the suggested correction direction, followed by instruction to adopt WA 5.7.0 first. Exact implementation acceptance remains governed by the next Work Unit.

## Timing

### Timing State

`Timing Proposed`

### Proposed Timing

After WA 5.7.0 onboarding is accepted and integrated, prioritize this one corrective Work Unit before resuming blocked AVAM S02-P1 native-fit work.

### Approved Timing

N/A as a separate formal Issue scheduling record; the Owner expressed intent to proceed after governance setup.

### Timing Decision Evidence

2026-11-18 conversation; pending formal Work Unit envelope.

## Verification Requirements

- Repeat original native-fit failure on unmodified v0.1.2 then pass on corrected candidate.
- All eligible subscribers attempted even if one synchronously throws; truthful `OmniResult` success retained.
- Direct/tree/global/parent, once/unsubscribe/throttle, undo and batch behavior retained.
- Invalid/unauthorized writes are neither committed nor published.
- Independent private roots and cross-root token rejection retained.
- Existing coercion, alerts, waiters, package exports, typecheck, full tests and Node-supported qualification remain compatible.
- Fresh packed `@r146023/omniturbo` consumer proves public API behavior.

## Implementation / Verification Evidence

None — source work is not yet authorized. No tag, merge, release or AVAM dependency update authorized by this Issue.

## Related Authorities and Work Units

- `docs/project/onboarding/WA-5.7.0-ADOPTION-0001.md` (governance-only)
- AVAM WU-0024 / S02-P1 evidence, distinct from any future OmniTurbo Work Unit.

## Review History

- `docs/project/reviews/integrity/AUDIT-0001.md` — initial onboarding discovery record.

## Current Decision Summary

Confirmed generic OmniTurbo defect; bounded safe corrective design proposed; **no currently authorized OmniTurbo source Work Unit**. The project adoption branch does not implement the fix.
