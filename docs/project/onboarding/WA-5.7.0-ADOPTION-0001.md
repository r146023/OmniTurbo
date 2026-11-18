# OmniTurbo — WA 5.7.0 Existing-Project Adoption 0001

**Date:** 2026-11-18
**State:** Candidate for Project Owner review; no automatic authority on `main`
**Scope:** Administrative onboarding of existing `r146023/OmniTurbo` to published Software Project Working Agreement v5.7.0

## Owner direction

The Project Owner asked to bring OmniTurbo under WA 5.7.0, then selected **RamonaFlowers** as the execution machine for this bounded governance onboarding. This authorizes preparing the migration evidence and reviewable candidate; it does not replace the separately required `I ACCEPT` for the subscriber-isolation source correction.

## Verified source and release identity

- OmniTurbo `main`: `baeb6919ec9720a9506053a4acd284a12c842b54` at onboarding start.
- Existing `v0.1.2` tag: same commit, published GitHub Release with package tarball and `SHA256SUMS`.
- WA 5.7.0: published GitHub Release dated 2026-09-13 and immutable `v5.7.0` tag at `bbae52d6c039c96ed81ac8d9411b881ffbf1af29`.
- No previously recorded canonical WA adoption, Project Data or Work Unit governance found in inspected OmniTurbo `main`, `EnhancedManagement`, or `work/release-hardening-0001` trees.
- One unrelated open Dependabot PR exists; no subscriber-correction PR identified.

## Administrative migration

1. Identify existing README, `docs/`, source tree and release workflow as existing current authorities without rewriting them.
2. Establish `docs/private/PROJECT_DATA.md`, a setup questionnaire, Idea/Issue/Review indexes and an inactive Proposal relevance index.
3. Record the AVAM-discovered subscriber failure as an OmniTurbo-native, Assistant-originated Issue. Do not treat issue capture as source-fix authorization.
4. Perform initial Structure Review and Integrity Audit at **migration baseline serial 0**, without inventing historical WA Work Units. Record the subsequently observed pre-existing red CI audit gate separately as `ASSISTANT-ISSUE-0002`; it is not a governance-document regression.
5. Preserve historical releases and docs unchanged; retain known non-blocking findings rather than opportunistic cleanup.
6. Present the governance-only branch for Owner acceptance. **Adoption is not authoritative on `main` until accepted and integrated.**

## Extension and planning boundary

- No Specialized Supporting Agreement was established as applicable.
- Formative Experiment governance: `N/A`; no participation activated.
- Experimental Proposals are relevance-classified only; no Trial is activated.
- No approved feature plan, GUI design baseline or formal staged Development Plan was discovered; use `N/A`, not retroactive invention. Corrective Issue work may be scoped as its own future Work Unit.

## Excluded actions

No changes to `src/`, `tests/`, `package.json`, `package-lock.json`, CI workflow, `README.md`, older releases/tags, AVAM files/dependencies, unrelated code, or product semantics. Do not self-approve the onboarding or the subscriber-isolation Work Unit.

## Verified PR CI limitation

After PR #4 was opened, Node 22 and Node 24 GitHub Actions jobs failed at the pre-existing `npm audit --audit-level=high` gate, reporting 12 dependencies with advisories (including 2 critical). The untouched package lockfile is identical to `main`. Source/build/packaged tests were skipped by CI. See `ASSISTANT-ISSUE-0002`. Do not represent CI as passing, automatically upgrade dependencies, or silently weaken the audit. Owner review must address the red baseline separately from the governance-content assessment.

## Current acceptance boundary

A reviewable governance-only branch is a **candidate**, not proof that the authoritative project has adopted the WA. Project Owner acceptance and separately authorized integration are required before `main` can be reported as governed by 5.7.0.

## Follow-on

After accepted adoption, use the Issue and v5.7.0 Work Unit rules to authorize the bounded subscriber-isolation correction. That correction remains a separate source-modifying Work Unit and must stop at Awaiting Review without self-merging or publishing.
