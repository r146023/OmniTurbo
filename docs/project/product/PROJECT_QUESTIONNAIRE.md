# Project Setup Questionnaire — OmniTurbo

**Project:** OmniTurbo
**Updated:** 2026-11-18
**Authority:** Reconstructed onboarding baseline / review candidate; existing source facts only. This does not invent new product decisions.

This is an inherited-project setup record. Unknown business, distribution, or product ambitions remain `Undecided` pending Owner direction and do not block the existing bounded maintenance objective.

## 1. Product identity and purpose

- **What is the product?** Framework-agnostic TypeScript governed path-state library.
- **What problem does it solve?** Controlled in-memory state updates with schema/datatype validation, privacy, structured results and subscriptions (`README.md`).
- **Who is it for?** TypeScript/Node consumers requiring governed state, including AV9X consumers; broader target audience Undecided.
- **What primary outcome justifies its existence?** Valid, authorized state becomes observable; invalid/unauthorized state is not committed (`README.md`).
- **What would make us say this product successfully exists?** Existing published `v0.1.2` API package imports and qualifies for supported Node runtimes; further product-success criteria Undecided.
- **What is explicitly outside its responsibility?** AVAM-specific Thing/Strata projection identity, durable application persistence and new language ports are outside the current bounded maintenance task; project-wide future non-goals Undecided.

## 1A. Project intent and business posture

- **Project motivation:** Undecided (not inferred from AV9X ecosystem use).
- **Intended AV9X product:** Undecided; existing AV9X consumer dependency is established.
- **Distribution posture:** Current public GitHub package Release; intended long-term posture Undecided.
- **Source visibility:** Public/Open (current repository).
- **UADS dependency/use:** Undecided.
- **Commercial intent:** Undecided.
- **Revenue model:** Undecided.
- **Market/competitor research:** Undecided.
- **Target-market/persona development:** Undecided.
- **Marketing strategy:** Undecided.
- **Marketing strategy readiness:** Not enough information.

### Commercial-planning handoff

- **Conditional commercial planning required for the current planning horizon:** Recheck later — current work is corrective foundation maintenance, not a new market/distribution strategy.
- **Commercial planning authority:** N/A for current corrective horizon; future Owner decision required if commercial intent becomes material.
- **Reason / recheck trigger:** Before adopting new commercial/distribution commitments, not as a prerequisite for fixing the verified subscriber defect.

## 2. Product form and target environment

- **Product form:** Library.
- **Target devices:** Node-capable hosts; further device support Undecided.
- **Target operating systems:** Undecided beyond existing Node ESM support claims.
- **Browser support:** Undecided; no browser compatibility assertion established by this onboarding.
- **Primary runtime environment:** Node ESM `>=22` (published package contract).
- **Connectivity model:** In-memory state engine itself requires no network connection; package acquisition/release may require network.

## 3. Frontend / interface stack

- **Interface type:** API-only.
- **Frontend language(s):** N/A (consumer applications own their frontend).
- **Frontend framework(s):** N/A; framework-agnostic.
- **Design system/component library:** N/A.
- **Desktop/mobile wrapper:** N/A.
- **Major interaction constraints:** Structured `OmniResult`, protected writes and subscription observer semantics are part of public contract.

## 4. Backend / application stack

- **Backend language(s):** N/A as an application backend; library implementation is TypeScript.
- **Backend framework(s):** N/A.
- **AVBack dependency:** No direct package dependency established.
- **AVAM dependency:** No direct package dependency; AVAM consumes OmniTurbo.
- **Other shared AV9X/platform dependencies:** None declared by `package.json`; consumer integrations are separate.
- **Background/headless operation:** Supported by Node library; specific consumer use is application-owned.

## 5. Data and persistence

- **Primary data ownership:** In-process OmniTurbo instance / privacy-governed paths.
- **Database/storage:** None in base library.
- **File/assets responsibility:** Packaged library output and release assets; no application file persistence implied.
- **Synchronization required:** No native cross-process sync requirement established.
- **Migration/versioning requirements:** npm package semver, compatible public API and immutable release tags.
- **Backup/recovery expectations:** Undecided at consumer level; OmniTurbo history/timeline are not durable persistence.

## 6. Identity, security, privacy

- **Accounts/authentication:** N/A as an application account system.
- **Single-user or multi-user:** N/A at library level; consumer-specific.
- **Authorization/roles:** Protected path privacy rules and private write tokens, not identity-service roles.
- **Sensitive/private data:** Potential consumer values; scope and controls are consumer-specific.
- **Security constraints:** No cross-root token authority expansion; invalid/unauthorized writes must fail before commit.
- **Telemetry/analytics policy:** Undecided; no new logger/monitoring system authorized.

## 7. Deployment and distribution

- **Deployment target:** Native Node ESM package consumers.
- **Distribution mechanism:** GitHub Release `.tgz` with `SHA256SUMS`; optional npm registry publication handled separately.
- **Update mechanism:** Explicit consumer dependency version changes; no forced updates.
- **Packaging/signing requirements:** `docs/releasing.md` defines build, package, hashes and release gates.
- **Production hosting dependencies:** N/A to library itself.

## 8. Integrations and external systems

- **Required external integrations:** None in package implementation beyond Node/npm toolchain.
- **Optional/future integrations:** Application consumers including AVAM; scope belongs to those projects.
- **External APIs/services:** GitHub release machinery only; no runtime external API requirement established.
- **External filesystem/device access:** N/A in base state-store behavior.
- **Interoperability commitments:** Public ESM package import, typed API, structured write results.

## 9. Existing/inherited authority

- **Existing source/codebase:** `r146023/OmniTurbo` `main` `baeb6919ec9720a9506053a4acd284a12c842b54`; release `v0.1.2`.
- **Existing product docs:** `README.md` and `docs/` (including `docs/releasing.md`).
- **Existing designs/Figma:** N/A / none identified.
- **Existing behavioral/OFD authority:** N/A / none identified.
- **Existing Development Plan:** N/A / none identified.
- **Legacy terminology/aliases:** `Omni`, `OmniTurbo`, `omni`, `omniTurbo` as in current published exports.

## 10. Hard constraints and non-goals

### Hard technical constraints
- Preserve validation, coercion, privacy and public result behavior unless separately approved.
- Qualify package consumers under supported Node ESM environments.

### Business/licensing constraints
- Existing Apache-2.0 license and official versioned release history remain unchanged.

### Privacy/security constraints
- Write tokens and privacy scope are not broadened by governance onboarding or subscriber fixes.

### Explicit non-goals / non-responsibilities
- Do not add AVAM-specific model features or rewrite OmniTurbo's existing architecture as part of this onboarding.
- Do not automatically publish a new OmniTurbo release.

## 11. Open foundational questions

| Question | State | Why it matters | Owning decision/authority |
|---|---|---|---|
| Long-term distribution/commercial posture | Undecided | Future business/product planning | Future Project Owner planning decision |
| Broader supported platform/browser matrix | Undecided | Compatibility commitments for future releases | Future Owner-approved product/technical authority |
| Formal product roadmap/Feature Ledger | Unknown | Later major feature planning | Future Project Owner planning boundary |

## 12. Reconciliation notes

- **Existing authority reused:** `README.md`, `docs/`, `src/`, `package.json`, `docs/releasing.md`, immutable `v0.1.2`.
- **Contradictions found:** Three README links to absent `docs/amber/` pages; observed as non-blocking stale documentation in initial audit, not corrected in this migration.
- **Smallest upstream authorities reopened:** None; onboarding does not rewrite product scope.
- **Material changes propagated:** Governance pointers and indexes only; no product modifications.

## 13. Proposal applicability handoff

- **Governing Working Agreement:** published `v5.7.0` (adoption candidate until integrated).
- **Proposal set checked:** `PROP-0001`–`PROP-0006`, `PROP-0008`–`PROP-0012` Candidate definitions packaged in WA 5.7.0.
- **Applicability Pass:** Complete for current maintenance/onboarding horizon; recheck on material lifecycle changes.
- **Applicability evidence:** Table below and `docs/project/proposals/INDEX.md`.
- **Relevant Proposals:** PROP-0004 @ 0.1.0 (relevant but inactive); PROP-0010 @ 0.1.0 (relevant later). No Trial recommended now.
- **Proposal governance index:** `docs/project/proposals/INDEX.md`.
- **Future recheck triggers:** Major qualification strategy change, major new product planning, or any deliberate parallel/multi-runner development program.

| Proposal | Current-horizon disposition | Evidence/rationale |
|---|---|---|
| PROP-0001 | NOT APPLICABLE | No separately proposed GitHub Procedures Trial; repository work follows established routing |
| PROP-0002 | NOT APPLICABLE | No WORK_CORPUS automatic WU/Stage closeout campaign |
| PROP-0003 | NOT APPLICABLE | AVBack Woodchipper campaign is a separate project concern |
| PROP-0004 | RELEVANT BUT INACTIVE | Qualification-risk discipline could help; ordinary package verification already governs |
| PROP-0005 | NOT APPLICABLE | No parallel development cohort authorized |
| PROP-0006 | NOT APPLICABLE | No Outcome Flow Diagram design task in this bounded correction |
| PROP-0008 | NOT APPLICABLE | No UX/design-realization planning task in this bounded correction |
| PROP-0009 | NOT APPLICABLE | No new entity-contract planning task in this bounded correction |
| PROP-0010 | RELEVANT LATER | Future major planning with unresolved assumptions may benefit; no Trial now |
| PROP-0011 | NOT APPLICABLE | No Figma/UI design workflow in API-library maintenance |
| PROP-0012 | NOT APPLICABLE | No new Entity Profile System design work |

**No Candidate Proposal Trial or Formative Experiment is activated by this pass.**
