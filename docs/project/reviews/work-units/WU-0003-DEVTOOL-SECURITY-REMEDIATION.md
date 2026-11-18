# WU-0003 — Development-Tooling Security Remediation and Next Release Candidate

**Project:** OmniTurbo — `r146023/OmniTurbo`
**Governing WA:** v5.7.0, immutable `r146023/ProjectWorkingAgreement` release
**State:** Active Work, not Owner-approved/Closed
**Machine:** RamonaFlowers (machine identity verified)
**Owner authorization, 2026-11-18:**

```text
I ACCEPT OMNITURBO WU-0003 — REMEDIATE THE NINE CURRENT DEVELOPMENT-TOOLING SECURITY FINDINGS ON RAMONAFLOWERS, REQUALIFY THE COMPLETE PACKAGE ON NODE 22 AND NODE 24, AND PREPARE A NORMAL-GATE SUCCESSOR RELEASE. PRESERVE THE PUBLISHED V0.1.3 RELEASE, KEEP ALL SECURITY AUDITS ENABLED, AND RETURN FOR MY I APPROVE BEFORE MERGE, TAG OR PUBLICATION.
```

## Baseline and bounded authorization

- Authoritative Owner-accepted source baseline: OmniTurbo `main` `6108e21efb52280f24cb8c2a181c8c0acce7eae0`, WU-0002 Owner-approved/Closed, accepted native WA Work Unit serial **2**.
- Published `v0.1.3` immutable release tag and package: `1bead142b2219f320590c0472aee2b3a3af3c766`. It must not be moved, replaced, retagged or republished during WU-0003.
- Initial `npm audit --json` on exact existing lockfile: **9 vulnerable entries: 4 moderate, 3 high, 2 critical**, all in development/testing dependencies. `ASSISTANT-ISSUE-0002` remains Open/U2, now authorized for bounded remediation.
- Existing Dependabot [PR #3](https://github.com/r146023/OmniTurbo/pull/3) proposes Rimraf 6.1.4, Vitest 5.x and TypeScript 7.x. Use it as read-only input, not as authority to merge or to take an unrelated TypeScript 7 major upgrade.
- Work branch and worktree: `work/wu-0003-devtool-security-remediation` / isolated RamonaFlowers workspace; no other project repository allowed.

## Authorized recognizable outcome and stopping boundary

1. Apply the **smallest compatible development/tooling dependency changes** needed to remedy the nine current audit findings. Prefer compatible Vitest and Rimraf fixed versions while holding TypeScript at a compatible 5.x release unless actual evidence requires otherwise. Do not create new runtime dependencies.
2. Run `npm audit --audit-level=high` and the full JSON audit on the real updated lockfile, with no suppression, fallback exception or false PASS. Aim for **zero total security advisories**, not only zero high/critical findings. Verify the production-only audit still reports zero.
3. Prepare a **normal-gate successor patch release candidate** (expected `0.1.4`, not yet accepted, tagged or published). Ensure version metadata/lockfile identity and retained v0.1.3-only exception stay honest and confined to that prior version. Public API behavior and subscriber isolation must remain intact.
4. Validate both Node 22 and Node 24 via clean `npm ci`, complete `npm run verify` (typecheck, full library test suite, negative security-policy tests, build, fresh native ESM packed-consumer smoke and pack check); preserve failing attempts/retests.
5. Perform release-focused Issue review and Governance Due Check under the actual WA. Governance/Structure cadence at accepted serial **3** is due only after WU-0003 acceptance/closeout; do not silently mark it already complete.
6. Deliver an exact mandatory WA Work Unit review at **Awaiting Review**, with commit SHAs, actual audit and full CI evidence, formal Issue/Idea categories and explicit next Owner action.

**Exclusions:** Do not modify AVAM, RAM_REPO, another project, `v0.1.3` tag/release, published assets, existing review authority, or npm registry. Do not merge the future candidate PR, tag or publish `v0.1.4` without the subsequent exact Owner `I APPROVE`. Do not mark formal Issue `ASSISTANT-ISSUE-0002` Closed or advance Accepted Work Unit Serial before final Owner acceptance and evidence.

## Execution ledger

**Current result: source/package checks complete locally; GitHub PR qualification pending.** The source implementation is confined to dev-dependency metadata and lockfile updates, with no library runtime code changes.

### Security baseline, choices and remediation

- `npm audit --json` before edits: 9 findings total (**4 moderate, 3 high, 2 critical**), all in existing development tooling. `vitest@5.1.1`, `rimraf@6.1.4`, and `typescript@5.9.3` confirmed available.
- Used `npm install --save-dev --save-exact vitest@5.1.1 rimraf@6.1.4 --no-fund` rather than merging stale Dependabot PR #3 (which includes unrelated TypeScript 7.0.2). No `npm audit fix --force` or CI/audit bypass.
- Exact versioned toolchain: Vitest **5.1.1**, Rimraf **6.1.4**, TypeScript **5.9.3**. Root `package.json` / `package-lock.json` version moved to **0.1.4** with `npm version 0.1.4 --no-git-tag-version`; **no Git tag created**.
- Updated full `npm audit --json` and `npm audit --audit-level=high`: **0 findings**, **exit 0**. Production-only `npm audit --omit=dev`: **0 findings**, **exit 0**. `node scripts/verify-audit-gate.mjs` reports `status: PASS` and `fullAuditExit: 0`, `productionAuditExit: 0` on both Node versions, explicitly **no exception used**; the previous v0.1.3-only exception policy remains version-confined.
- `package.json` declares **zero production or optional dependencies**; TypeScript 7 not adopted and no source behavior changed.

### Node 22.23.5 and Node 24.19.0 qualification (RamonaFlowers)

| Check | Node 22.23.5 | Node 24.19.0 |
|---|---|---|
| Clean `npm ci` from exact successor lock | **PASS**, 0 vulnerabilities | **PASS**, 0 vulnerabilities |
| Vitest library suite | **PASS — 138/138 tests, 19 files** | **PASS — 138/138 tests, 19 files** |
| Existing security-policy negative tests | **PASS — 14/14** | **PASS — 14/14** |
| `npm run typecheck` | **PASS** | **PASS** |
| `npm run build` | **PASS** | **PASS** |
| Fresh packed native Node ESM consumer | **PASS** | **PASS** |
| `npm run pack:check` | **PASS** | **PASS** |
| Full `npm audit --audit-level=high` | **PASS — zero** | **PASS — zero** |
| Production-only audit | **PASS — zero** | **PASS — zero** |
| Normal release audit guard | **PASS (no exception)** | **PASS (no exception)** |
| GitHub CI | **PENDING** | **PENDING** |

### Additional fresh installed-package proof

A distinct local `npm pack` produced `r146023-omniturbo-0.1.4.tgz` (**53,002 bytes**, SHA-256 `853747f2abd4238acd0e6952ec78e1b892027ceaa31d3e949a108535f89d143c`). Installed into a fresh external npm consumer and imported via native Node ESM. Verified that a throwing post-commit callback does not change committed write truth, does not disclose the raw exception, and does not suppress a later subscriber: **PASS**. This remains a **local candidate**, not the published package asset.

### Failed command / execution observation

An incidental one-line PowerShell-launched `node -e` package metadata probe failed due to nested quoting. It did not run product verification or modify source. Separate readback of package/lock versions and exact resolved tool versions succeeded; both complete Node22/24 verification and audit gates succeeded. Baseline pre-fix audit failure (9 findings) remains reported, not erased.

### Formal Issue and next release boundary

`ASSISTANT-ISSUE-0002` remains **Open / candidate correction Verified**, pending acceptance and publication of a normal-gate successor release. `ASSISTANT-ISSUE-0001` remains Closed and its subscriber behavior regressed successfully. No new Issue or Idea was required. Release-focused Issue and Governance Due Check: `docs/project/reviews/targeted/V014-RELEASE-READINESS-0001.md`.

**Next:** Stage scoped changes, open PR and verify true Node 22/24 GitHub CI with raw audit evidence. Deliver full WA 5.7.0 Owner-facing review at **Awaiting Review** and **stop before merge, tag, publication**. Accepted WU serial remains **2** until Owner acceptance. Normal Governance/Structure reviews become due when serial reaches **3**.
