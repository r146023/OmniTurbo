# WU-0001 — Bounded Post-Commit Subscriber Failure Isolation

**Project:** OmniTurbo
**Governing Working Agreement:** Published v5.7.0
**Work Unit State:** Active Work — correction under execution; no Owner acceptance
**Date Authorized:** 2026-11-18
**Authorized Execution Machine:** RamonaFlowers
**Authoritative Accepted Base:** `main` `ae0787427414206cde394516c2c3658f829d18c4` (WA 5.7.0 adoption); released package `v0.1.2` remains at `baeb6919ec9720a9506053a4acd284a12c842b54`
**Working Branch:** `work/subscriber-isolation-0001`
**Scheduled Issue:** `docs/project/issues/assistant/ASSISTANT-ISSUE-0001.md`

## Exact Owner authorization

```text
I APPROVE OMNITURBO ASSISTANT-ISSUE-0001 RESOLUTION AND TIMING; I ACCEPT THE BOUNDED OMNITURBO SUBSCRIBER-ISOLATION CORRECTION ON RAMONAFLOWERS
```

The Owner previously approved the refined technical direction on 2026-11-18, and separately directed that `ASSISTANT-ISSUE-0002` dependency-audit remediation be deferred, not used to block subscriber work.

## Authorized objective

Correct the **verified synchronous post-commit subscriber exception isolation defect** in OmniTurbo. A successfully committed write must return its truthful structured `OmniResult` and continue notifying every other eligible subscriber even if one callback throws.

## Authorized implementation envelope

1. Demonstrate original `v0.1.2` failure in a native regression test (and preserve AVAM's original reproduction as evidence).
2. Implement the smallest compatible fix at the shared `SubscriptionRegistry.notify()` dispatch boundary, collecting **sanitized warnings in the existing `OmniResult.issues`** without changing committed success/rejection semantics.
3. Preserve direct/global/tree/parent subscription arguments and ordering, `once`, unsubscribe and throttling, including failed attempts.
4. Keep privacy/token checks, schema validation/coercion, no-notify failed writes and pre-commit failures unchanged.
5. Test protected independent roots and cross-root token denial, direct/global/tree/parent, listener lifecycle, `undo` and notified `batch` paths.
6. Include verification through a freshly installed packed `@r146023/omniturbo` consumer using only public exports.
7. Run focused tests, full `npm test`, `npm run typecheck`, `npm run build`, `npm run test:package`, `npm run pack:check`/`npm run verify`, and classify the separately known red dependency-audit check accurately.
8. Update only necessary implementation-facing docs and review evidence, then commit/push on an isolated branch and present for Owner review.

## Explicit exclusions

- No AVAM source/dependency edits or AVAM-specific Thing/Strata projection API.
- No broad subscription redesign, generalized diagnostics/logging infrastructure, or asynchronous Promise rejection supervision.
- No change to unrelated coercer, validator, privacy, alert, waiter, batching, history or timing-system contracts.
- No dependency upgrades, `npm audit` suppression, security-gate weakening, or unrelated maintenance. `ASSISTANT-ISSUE-0002` remains deferred and open.
- No release/version publication, retagging `v0.1.2`, merge, self-approval or acceptance-dependent Work Unit closeout.

## Material decision / stopping boundary

If preserving truthful committed results requires a materially incompatible public result change, token exposure, broad subsystem redesign, or alteration to pre-commit failure semantics, stop and seek Owner decision rather than expanding scope.

Otherwise stop when correction and qualification are ready for **Awaiting Review**. Record exact tests/commits, any nonblocking known failures, and Owner action; no acceptance-dependent review serial/Issue closure may advance until `I APPROVE`.

## Verified starting position

- WA v5.7.0 adopted on `main` through accepted governance PR #4.
- Native accepted Work Unit Serial 0, no prior native Work Unit.
- Existing normal subscription tests did not cover throwing callbacks.
- Existing independent `ASSISTANT-ISSUE-0002` audit blocker was deferred by Owner; no unrelated dependency work authorized.

## Execution and evidence

**In progress.** Implementation and qualification evidence will be added before entering Awaiting Review. This record does not predeclare success.
