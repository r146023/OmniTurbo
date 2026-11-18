/**
 * WU-0002: explicitly Owner-risk-accepted v0.1.3 development-tooling exception.
 *
 * Never treats npm audit as passing. It permits only the exact documented,
 * dev-only advisory set on the frozen v0.1.3 lockfile, after the production
 * dependency audit returns zero findings. Every other version retains the
 * existing fatal full-audit requirement.
 */
export const EXCEPTION_VERSION = "0.1.3";
export const LOCKFILE_SHA256_LF = "7472d9045748abe5de7df3046a558341b2f8bf31c570ca4a45e8005bea6fa254";

export const ALLOWED = Object.freeze({
  "@vitest/mocker": { severity: "moderate", direct: false,
    via: ["GHSA-82fw-gwwq-j7x9", "GHSA-qxg6-89mg-rqv8"] },
  "brace-expansion": { severity: "high", direct: false,
    via: ["GHSA-q2hr-2g5m-vwhr", "GHSA-qhr7-859c-m2p7", "GHSA-6j4f-fj2g-mc7p"] },
  "glob": { severity: "moderate", direct: false,
    via: ["GHSA-3g3m-2fjr-6pw4", "minimatch"] },
  "minimatch": { severity: "moderate", direct: false,
    via: ["GHSA-g3hv-75wg-m249"] },
  "rimraf": { severity: "moderate", direct: true,
    via: ["glob"] },
  "source-map-js": { severity: "high", direct: false,
    via: ["GHSA-68fv-2mgg-jv7q"] },
  "tinypool": { severity: "critical", direct: false,
    via: ["GHSA-5gmw-xhrv-c9v3", "GHSA-85c8-ppgw-ccpr"] },
  "vite": { severity: "high", direct: false,
    via: ["GHSA-698v-4r3x-3vcv", "GHSA-r825-w8mm-5pxw",
      "GHSA-587h-7wmj-h5pm", "GHSA-9jrq-w75r-8gcw",
      "GHSA-rq7h-c2jc-7f22"] },
  "vitest": { severity: "critical", direct: true,
    via: ["@vitest/mocker", "GHSA-82fw-gwwq-j7x9", "tinypool"] },
});

const SEVERITY = Object.freeze({ info: 0, low: 1, moderate: 2, high: 3, critical: 4 });
export const ADVISORY_SEVERITY = Object.freeze({
  "GHSA-82fw-gwwq-j7x9": "moderate",
  "GHSA-qxg6-89mg-rqv8": "moderate",
  "GHSA-q2hr-2g5m-vwhr": "moderate",
  "GHSA-qhr7-859c-m2p7": "high",
  "GHSA-6j4f-fj2g-mc7p": "high",
  "GHSA-3g3m-2fjr-6pw4": "moderate",
  "GHSA-g3hv-75wg-m249": "moderate",
  "GHSA-68fv-2mgg-jv7q": "high",
  "GHSA-5gmw-xhrv-c9v3": "critical",
  "GHSA-85c8-ppgw-ccpr": "critical",
  "GHSA-698v-4r3x-3vcv": "moderate",
  "GHSA-r825-w8mm-5pxw": "moderate",
  "GHSA-587h-7wmj-h5pm": "high",
  "GHSA-9jrq-w75r-8gcw": "low",
  "GHSA-rq7h-c2jc-7f22": "moderate"
});
const MAX = Object.freeze({ info: 0, low: 0, moderate: 4, high: 3, critical: 2, total: 9 });

function ensure(condition, message) {
  if (!condition) throw new Error("Release security gate: " + message);
}

function countsFrom(report) {
  ensure(report && typeof report === "object" && !report.error &&
    report.metadata && report.vulnerabilities &&
    typeof report.vulnerabilities === "object", "invalid/incomplete npm audit JSON");
  const counts = report.metadata.vulnerabilities;
  ensure(counts && Object.keys(MAX).every(k => Number.isInteger(counts[k]) && counts[k] >= 0),
    "missing/invalid audit counts");
  return counts;
}

export function assessAuditGate({
  version, lockSha256, runtimeDependencyCount, fullExit, fullReport,
  productionExit, productionReport
}) {
  const production = countsFrom(productionReport);
  ensure(productionExit === 0, "production npm audit did not pass");
  ensure(Object.keys(productionReport.vulnerabilities).length === 0 &&
    Object.values(production).every(n => n === 0),
    "production dependency graph has an advisory");

  const full = countsFrom(fullReport);
  ensure(fullExit === 0 || fullExit === 1, "full audit failed for an unexpected reason");
  ensure(Object.keys(fullReport.vulnerabilities).length === full.total,
    "full audit counts disagree with package entries");
  if (fullExit === 0) {
    ensure(full.high === 0 && full.critical === 0,
      "full audit exit status contradicts high/critical findings");
    return { status: "PASS", version, reason: "Full npm audit passed; no exception used." };
  }

  ensure(version === EXCEPTION_VERSION, "no failed-full-audit exception for version " + version);
  ensure(lockSha256 === LOCKFILE_SHA256_LF, "lockfile differs from specifically approved graph");
  ensure(runtimeDependencyCount === 0, "production dependency declaration changed");
  ensure(Object.keys(MAX).every(k => full[k] <= MAX[k]),
    "audit severity counts exceed the Owner-accepted snapshot");
  ensure(full.high > 0 || full.critical > 0,
    "failed audit has no high/critical finding; refusal to infer cause");

  for (const [name, finding] of Object.entries(fullReport.vulnerabilities)) {
    const approved = ALLOWED[name];
    ensure(approved, "unexpected vulnerable package: " + name);
    ensure(SEVERITY[finding.severity] !== undefined &&
      SEVERITY[finding.severity] <= SEVERITY[approved.severity],
      "severity escalated for " + name);
    ensure(finding.isDirect === approved.direct, "dependency scope changed for " + name);
    ensure(Array.isArray(finding.nodes) && finding.nodes.length === 1 &&
      finding.nodes[0] === "node_modules/" + name,
      "vulnerable dependency location changed for " + name);
    ensure(Array.isArray(finding.via) && finding.via.length > 0,
      "missing advisory details for " + name);
    const allowVia = new Set(approved.via);
    for (const via of finding.via) {
      let id;
      if (typeof via === "string") {
        id = via;
        ensure(Object.hasOwn(ALLOWED, id), "transitive finding outside allowed graph");
      } else {
        ensure(via && typeof via === "object" &&
          via.name === name && typeof via.url === "string",
          "invalid advisory metadata for " + name);
        const match = /^https:\/\/github\.com\/advisories\/(GHSA-[a-z0-9-]+)$/.exec(via.url);
        ensure(match, "unknown advisory source for " + name);
        id = match[1];
        ensure(allowVia.has(id), "unapproved advisory " + id + " on " + name);
        ensure(SEVERITY[via.severity] !== undefined &&
          SEVERITY[via.severity] <= SEVERITY[ADVISORY_SEVERITY[id]],
          "individual advisory severity escalated for " + id);
      }
      ensure(allowVia.has(id), "unapproved advisory " + id + " on " + name);
    }
  }

  return {
    status: "OWNER_ACCEPTED_EXCEPTION",
    version,
    findings: full.total,
    critical: full.critical,
    high: full.high,
    moderate: full.moderate,
    reason: "Full npm audit FAILED; v0.1.3-only exception matched unchanged lockfile, exact approved findings and zero production advisories."
  };
}
