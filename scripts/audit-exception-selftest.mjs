import test from "node:test";
import assert from "node:assert/strict";
import { ADVISORY_SEVERITY, ALLOWED, EXCEPTION_VERSION, LOCKFILE_SHA256_LF, assessAuditGate } from "./audit-exception-policy.mjs";

const MAX = { info: 0, low: 0, moderate: 4, high: 3, critical: 2, total: 9 };
const zero = { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };

function fixture() {
  const vulnerabilities = Object.fromEntries(Object.entries(ALLOWED).map(([name, allow]) => [
    name, {
      severity: allow.severity,
      isDirect: allow.direct,
      nodes: ["node_modules/" + name],
      via: allow.via.map(id => id.startsWith("GHSA-")
        ? { name, url: "https://github.com/advisories/" + id, severity: ADVISORY_SEVERITY[id] }
        : id)
    }
  ]));
  return {
    version: EXCEPTION_VERSION,
    lockSha256: LOCKFILE_SHA256_LF,
    runtimeDependencyCount: 0,
    fullExit: 1,
    fullReport: { metadata: { vulnerabilities: structuredClone(MAX) }, vulnerabilities },
    productionExit: 0,
    productionReport: { metadata: { vulnerabilities: structuredClone(zero) }, vulnerabilities: {} }
  };
}

test("pin: approved v0.1.3 nine dev-only advisory packages are auditable, not green", () => {
  const decision = assessAuditGate(fixture());
  assert.equal(decision.status, "OWNER_ACCEPTED_EXCEPTION");
  assert.equal(decision.critical, 2);
  assert.equal(decision.findings, 9);
});

test("non-exempt versions reject a failed full audit", () => {
  const f = fixture();
  f.version = "0.1.4";
  assert.throws(() => assessAuditGate(f), /no failed-full-audit exception/);
});

test("any dependency lockfile change invalidates the exception", () => {
  const f = fixture();
  f.lockSha256 = "changed";
  assert.throws(() => assessAuditGate(f), /lockfile differs/);
});

test("new advisory against an otherwise approved package fails closed", () => {
  const f = fixture();
  f.fullReport.vulnerabilities.tinypool.via.push({
    name: "tinypool", url: "https://github.com/advisories/GHSA-new-new-new"
  });
  assert.throws(() => assessAuditGate(f), /unapproved advisory/);
});

test("new vulnerable package fails closed even with the same reported total", () => {
  const f = fixture();
  delete f.fullReport.vulnerabilities.minimatch;
  f.fullReport.vulnerabilities.unknown = {
    severity: "moderate", isDirect: false,
    nodes: ["node_modules/unknown"], via: ["minimatch"]
  };
  assert.throws(() => assessAuditGate(f), /unexpected vulnerable package/);
});

test("production audit must succeed with zero findings", () => {
  const f = fixture();
  f.productionExit = 1;
  assert.throws(() => assessAuditGate(f), /production npm audit did not pass/);
  f.productionExit = 0;
  f.productionReport.metadata.vulnerabilities.critical = 1;
  assert.throws(() => assessAuditGate(f), /production dependency graph has an advisory/);
});

test("new runtime dependencies invalidate exception", () => {
  const f = fixture();
  f.runtimeDependencyCount = 1;
  assert.throws(() => assessAuditGate(f), /production dependency declaration changed/);
});

test("severity escalation invalidates exception", () => {
  const f = fixture();
  f.fullReport.vulnerabilities.minimatch.severity = "critical";
  assert.throws(() => assessAuditGate(f), /severity escalated/);
});

test("additional advisory count invalidates exception", () => {
  const f = fixture();
  f.fullReport.metadata.vulnerabilities.critical = 3;
  f.fullReport.metadata.vulnerabilities.total = 10;
  assert.throws(() => assessAuditGate(f), /counts disagree/);
});

test("changed direct-dependency classification fails closed", () => {
  const f = fixture();
  f.fullReport.vulnerabilities.vitest.isDirect = false;
  assert.throws(() => assessAuditGate(f), /dependency scope changed/);
});

test("unexpected or invalid audit response fails closed", () => {
  const f = fixture();
  f.fullReport.error = {code:"ENOAUDIT"};
  assert.throws(() => assessAuditGate(f), /invalid\/incomplete npm audit JSON/);
  delete f.fullReport.error;
  f.fullExit = 2;
  assert.throws(() => assessAuditGate(f), /unexpected reason/);
});

test("normal zero-high audit passes on any other version without exception", () => {
  const f = fixture();
  f.version = "0.1.4";
  f.fullExit = 0;
  f.fullReport.metadata.vulnerabilities = structuredClone(zero);
  f.fullReport.vulnerabilities = {};
  assert.equal(assessAuditGate(f).status, "PASS");
});

test("reduced approved advisory set can pass only after counts reconcile", () => {
  const f = fixture();
  delete f.fullReport.vulnerabilities.minimatch;
  f.fullReport.metadata.vulnerabilities.moderate = 3;
  f.fullReport.metadata.vulnerabilities.total = 8;
  assert.equal(assessAuditGate(f).findings, 8);
});

test("an existing low-severity GHSA escalating to high fails closed", () => {
  const f = fixture();
  const vuln = f.fullReport.vulnerabilities.vite.via.find(v =>
    typeof v !== "string" && v.url.endsWith("/GHSA-9jrq-w75r-8gcw"));
  assert.ok(vuln);
  vuln.severity = "high";
  assert.throws(() => assessAuditGate(f), /individual advisory severity escalated/);
});
