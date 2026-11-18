# Project Data — OmniTurbo

**Status:** Active/maintenance, governed by WA 5.7.0 on `main`. Owner-approved WU-0001/WU-0002 work and the WU-0003 normal-gate dev-tooling security remediation are integrated. Official `v0.1.4` is published with full/production audits passing; current accepted Work Unit serial and due reviews are recorded in the Review Index.

## Identity

| Field | Value |
|---|---|
| Internal title | OmniTurbo |
| Public title | OmniTurbo |
| Aliases | Omni, `@r146023/omniturbo` |
| Description | Framework-agnostic TypeScript governed path-state library with schema, datatype, privacy, structured-result, history and subscription capabilities |
| Project type | Library |
| Project status | Active / maintenance |
| License | Apache-2.0 |
| Repository | `r146023/OmniTurbo` |

## Current sources of truth

| Field | Value |
|---|---|
| Working-agreement version | `5.7.0` — Owner-authorized adoption integrated through PR #4 on `main` |
| Working Agreement source | Immutable `r146023/ProjectWorkingAgreement` tag `v5.7.0` (`bbae52d6c039c96ed81ac8d9411b881ffbf1af29`); published release `SoftwareProjectWorkingAgreement-v5.7.0.zip` |
| Applicable SSAs | None identified; no active SSA |
| Formative Experiment governance index | N/A — no authorized participation |
| Proposal governance index | `docs/project/proposals/INDEX.md` — relevance only; no active Trial |
| Current source package | `r146023/OmniTurbo` `main`, including Owner-approved WU-0003 development-tooling remediation merged in [PR #8](https://github.com/r146023/OmniTurbo/pull/8). **Latest published release: [`v0.1.4`](https://github.com/r146023/OmniTurbo/releases/tag/v0.1.4)** tagged to exact source commit `94769f173828cc622628c7b2889cd94d60e902ac` with full and production audit **0 findings**. Historical `v0.1.3` tag `1bead142b2219f320590c0472aee2b3a3af3c766` and earlier releases remain immutable |
| Planning-status authority | N/A — no separately approved planning-status authority established |
| Project Setup Questionnaire | `docs/project/product/PROJECT_QUESTIONNAIRE.md` (reconstructed setup; unresolved fields explicit) |
| Feature Ledger | N/A for this maintenance/onboarding scope; no approved feature-ledger authority identified |
| Current product documentation | `README.md`; `docs/api/`, `docs/concepts/`, `docs/schemas/`, `docs/datatypes/`, `docs/privacy/`, `docs/subscriptions/` and other maintained `docs/` |
| Current behavioral/OFD registry | N/A; no current OFD authority identified |
| Current release roadmap/scope | `docs/releasing.md` for release procedure; no separate approved roadmap identified |
| Current approved design baseline/coverage | N/A — library has no approved GUI design baseline identified |
| Current technical readiness/architecture | `docs/internals/internal-architecture.md`, `docs/getting-started/project-structure.md`, `docs/concepts/side-effect-lifecycle.md`, `docs/releasing.md`, and current `src/` |
| Current Development Plan | N/A — no approved staged Development Plan identified; corrective work requires its own bounded Work Unit |
| Idea index | `docs/project/ideas/INDEX.md` |
| Issue index | `docs/project/issues/INDEX.md` |
| Review index | `docs/project/reviews/INDEX.md` |
| Project root in archive | `.` |
| Private docs path | `docs/private/` |
| Project-management docs path | `docs/project/` |

Source of governance adoption rationale, Owner direction, and historical boundary: `docs/project/onboarding/WA-5.7.0-ADOPTION-0001.md`. The version applies to `main` only after the Owner-authorized PR #4 integration. There are no retroactively asserted WA-governed Work Units, audit results, or product acceptance decisions before onboarding.

## Product and design authority

Current source behavior is established by `main`, README and maintained `docs/` where consistent. **Current installable GitHub package: published `v0.1.4`**, reproducing WU-0001 subscriber correction and WU-0003 development-tooling security remediation under the **normal full-audit gate with zero findings**. Prior published `v0.1.3` remains immutable with its version-specific historical Owner-risk-accepted tooling advisories. See `docs/project/releases/V0.1.4-RELEASE-VERIFICATION.md` for source/tag, package SHA-256, actual security reports, CI and fresh installed-consumer proof.

## Governance authority

- **Idea Index:** `docs/project/ideas/INDEX.md`
- **Issue Index:** `docs/project/issues/INDEX.md`
- **Review Index:** `docs/project/reviews/INDEX.md`
- **Onboarding Structure Review:** `docs/project/reviews/structure/STRUCTURE-0001.md`
- **Onboarding Integrity Audit:** `docs/project/reviews/integrity/AUDIT-0001.md`
- **Formative Experiment:** N/A
- **Experimental Proposals:** `docs/project/proposals/INDEX.md` (none active)
- **Alternative legacy governance:** none found in current main or inspected historical branches

## Technology

| Field | Value |
|---|---|
| Languages | TypeScript, JavaScript (ESM), Markdown |
| Runtime versions | Node.js `>=22`; CI qualifies Node 22 and 24 |
| Frameworks | Framework-agnostic |
| Package managers | npm, lockfile-based |
| Database | None; in-memory state store |
| Target platforms | Native Node ESM on supported Node versions; specific OS compatibility claims not independently established |
| Build system | TypeScript compiler (`tsc`, NodeNext) |
| Test framework | Vitest; native installed-package ESM smoke test |

## Canonical commands

```text
Install:    npm ci
Develop:    N/A
Build:      npm run build
Test:       npm test
Lint:       N/A
Typecheck:  npm run typecheck
Format:     N/A
Package:    npm pack --dry-run
Qualify:    npm run verify
Audit deps: npm audit --audit-level=high
Consumer:   npm run test:package
```

`docs/releasing.md` governs release-specific CI, packaging, signing/hash evidence and release workflow semantics.

## Constraints

### Hard requirements
- Preserve governed privacy/validation before publication and structured `OmniResult` semantics.
- Keep package-consumer native-ESM qualification and release identity checks.
- Treat `v0.1.2` and older historical evidence as immutable historical baselines.

### Non-goals
- No AVAM-specific Thing or Strata implementation, no new shared-state architecture, and no unrelated product redesign during governance adoption.
- No automatically activated Proposal Trial, Formative Experiment, or separate release.

### Compatibility commitments
- Preserve existing documented APIs unless an independently authorized correction specifies a compatible change.
- An accepted governance migration alone does not alter library behavior.

### Architecture rules
- Current source and existing `docs/internals/` are product/technical authorities subject to any later explicitly accepted decisions.

### UI and accessibility rules
- N/A for this API library.

### Dependency rules
- `package-lock.json` and `docs/releasing.md` define current reproducibility/qualification expectations.

### Privacy and security rules
- Protected write tokens remain runtime-private; no token authority is exposed or expanded by governance changes.

## Update rule

Update this index when its stable authority pointers or project facts change. Keep volatile Work Unit, Issue, Proposal Trial, review cadence and acceptance state in their owning indexes/records, not here.
