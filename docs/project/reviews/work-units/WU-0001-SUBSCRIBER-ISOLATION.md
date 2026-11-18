# WU-0001 — Bounded Post-Commit Subscriber Failure Isolation

**Project:** OmniTurbo
**Governing Working Agreement:** Published v5.7.0
**Work Unit State:** Awaiting Review — locally qualified correction, no Owner acceptance or release
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

**Implementation and qualification are complete to the extent documented below; Awaiting Review, not accepted.**

## Owner review delivery — 2026-11-18

**Outcome:** A synchronous subscriber exception no longer makes an already committed mutation appear to have failed or suppresses other eligible observer callbacks. The fix belongs to OmniTurbo, not AVAM.

**Primary artifact:** [OmniTurbo PR #5](https://github.com/r146023/OmniTurbo/pull/5)

**Implementation commit:** `921c4c9c6f95a6612bade470fbab6a83a797853f`
**Base:** `ae0787427414206cde394516c2c3658f829d18c4`
**Result:** Implemented and locally qualified; CI security audit still fails from unrelated prior dependencies.
**Current state:** Awaiting Review.

### Implemented behavior

- `src/subscriptions/subscriptions.ts`: isolate each synchronous direct, global, tree and parent callback; return sanitized `OMNI_SUBSCRIBER_CALLBACK_FAILED` warning(s), with only a static callback category in `details.kind`, and continue eligible deliveries.
- `src/Omni.ts`: successful committed writes and `undo()` include those warnings inside existing `OmniResult.issues`. `success: true`, `changed: true`, `rejected: false` and committed values are preserved.
- Callback arguments, established notification order, `once`, throttle and unsubscribe behavior stay intact. Pre-commit coercion, validation, and protected-token authority are untouched.
- New `tests/omni/subscriber-isolation.test.ts` covers the correction and pre-existing contracts, including number-to-string coercion.
- Extended `scripts/package-consumer-smoke.mjs` validates observer isolation through a fresh installed package via public exports, cross-root write-token separation, invalid-write suppression, and nonleakage of raw observer errors.
- The package smoke harness uses npm's JS CLI on Windows because the pre-existing `execFileSync("npm.cmd")` invocation failed with `EINVAL` under the approved Node 24 environment. This is a narrow qualification-harness correction, not a runtime redesign.
- `docs/subscriptions/subscriptions.md` documents the new synchronous warning semantics.
- Issue 0001 resolution/timing approval and active WU link were recorded; acceptance-dependent project serial remains 0.

### Actual verification

| Test / check | Result |
|---|---|
| Original defect, before source fix | **Expected RED:** 5 failed, 2 passed (7 initial regression tests) |
| Corrected focused regression | **PASS:** 8/8 |
| `npm ci` | **PASS** on RamonaFlowers, Node v24.19.0 |
| `npm run verify` | **PASS:** includes typecheck, full **138/138 tests in 19 files**, build, fresh packed-package consumer, and `pack:check` |
| AVAM original native-fit desired contracts | **PASS:** 2/2 via `node --test --test-name-pattern='^OmniTurbo'` against fresh installed corrected tarball; original AVAM script copied unchanged from isolated S02-P1 branch |
| `git diff --check`, package metadata integrity | **PASS:** lockfile and package metadata unchanged |
| `npm audit --audit-level=high` | **FAIL (pre-existing):** 12 advisories: 4 moderate, 6 high, 2 critical; lockfile blob `a6cabee23959d18708d2f383c14af6a4f7957045` unchanged |
| GitHub Actions PR #5 on Node 22 and Node 24 | **FAIL at pre-existing audit step** after successful `npm ci`; the later CI verification step was skipped; Node 22 source/package qualification is **not** established. [Run 44346540889](https://github.com/r146023/OmniTurbo/actions/runs/44346540889) |

The package tarball used for qualification is a **temporary candidate** retaining the existing `0.1.2` metadata. Published `v0.1.2` remains immutable. No package version bump, tag, GitHub Release, npm publication, AVAM code, or AVAM pinned dependency was changed.

### Formal Issues and ideas

- `ASSISTANT-ISSUE-0001`: scheduled and implemented within approved resolution/timing, but remains **Open / Resolution Approved** until Project Owner acceptance-dependent closeout.
- `ASSISTANT-ISSUE-0002`: pre-existing dependency-audit findings remain **Open / deferred by Owner**. No investigative campaign, upgrade or security bypass was performed.
- No new unrelated formal Issue or Idea was created in this Work Unit.

### Deviations, limits and compatibility

- The only additional change discovered during qualification was the small Windows npm smoke-launcher correction required for a working installed-package test.
- Synchronous callback throws are isolated; **asynchronous Promise rejections are deliberately excluded**.
- Alerts, waiters, pre-commit validators/coercers, private write-token rules, and subscription timing parameters were not redesigned.
- The current package is **not release-qualified** while the repository security audit is failing. That known finding is separately governed, and publication requires an explicit subsequent release-gate disposition.
- This Work Unit authorizes neither a release nor downstream AVAM S02-P1 implementation.

### Next steps and Owner action

WU-0001 is **Awaiting Review**. Review [PR #5](https://github.com/r146023/OmniTurbo/pull/5) and this evidence. For full Work Unit acceptance, the applicable phrase is:

```text
I APPROVE
```

If approved, close WU-0001 under WA 5.7.0, reconcile Issue 0001 as supported by accepted evidence, and advance Accepted Work Unit Serial exactly once from **0 to 1**. Acceptance does **not** itself merge source, release OmniTurbo, override a red release audit, or authorize AVAM's dependency update.

**Next planned Work Unit:** A separately authorized OmniTurbo integration/versioned-release step (or other explicit release-gate disposition), followed by an independently authorized AVAM pinned-package update and native-fit requalification. **Not authorized** at this review gate.

No acceptance-dependent governance state has advanced beyond the last Project Owner-accepted position.
