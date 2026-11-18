/**
 * Executes (never disables) the two npm security audits.
 * Writes the COMPLETE machine-readable reports, logs them for CI visibility,
 * and applies the strictly bounded v0.1.3 Owner-approved dev-tooling policy.
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assessAuditGate } from "./audit-exception-policy.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportsDir = join(root, ".release-audit");

function audit(args, label) {
  // npm.cmd cannot be used with spawnSync on Windows/Node 24.
  const npmCli = join(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js");
  const exe = process.platform === "win32" ? process.execPath : "npm";
  const argv = process.platform === "win32"
    ? [existsSync(npmCli) ? npmCli : process.env.npm_execpath, "audit", ...args, "--json"]
    : ["audit", ...args, "--json"];
  if (argv.some(a => typeof a !== "string" || !a.trim())) {
    throw new Error("Cannot locate npm CLI on this Node runtime");
  }
  const result = spawnSync(exe, argv, {
    cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024, windowsHide: true
  });
  console.log("=== " + label + ": FULL NPM AUDIT JSON BEGIN ===");
  console.log(result.stdout || "(no JSON output)");
  console.log("=== " + label + ": FULL NPM AUDIT JSON END ===");
  if (result.stderr) console.error(label + " stderr: " + result.stderr);
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(join(reportsDir, label + ".json"), result.stdout || "", "utf8");
  if (result.error) throw result.error;
  let report;
  try {
    report = JSON.parse(result.stdout);
  } catch (e) {
    throw new Error(label + " audit did not return usable JSON: " + e.message);
  }
  return { exit: result.status, report };
}

try {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const lockText = readFileSync(join(root, "package-lock.json"), "utf8")
    .replace(/\r\n/g, "\n");
  const lock = JSON.parse(lockText);
  if (pkg.version !== lock.version || pkg.version !== lock.packages?.[""]?.version) {
    throw new Error("package.json / package-lock.json versions disagree");
  }
  const lockSha256 = createHash("sha256").update(lockText).digest("hex");
  const runtimeDependencyCount =
    Object.keys(pkg.dependencies ?? {}).length +
    Object.keys(pkg.optionalDependencies ?? {}).length;

  const full = audit(["--audit-level=high"], "full");
  const production = audit(["--omit=dev", "--audit-level=high"], "production");

  const decision = assessAuditGate({
    version: pkg.version, lockSha256, runtimeDependencyCount,
    fullExit: full.exit, fullReport: full.report,
    productionExit: production.exit, productionReport: production.report
  });
  console.log("=== AUDIT GATE DECISION ===");
  console.log(JSON.stringify({
    ...decision, fullAuditExit: full.exit, productionAuditExit: production.exit,
    lockfileSha256: lockSha256, reportsDirectory: ".release-audit"
  }, null, 2));
  if (decision.status === "OWNER_ACCEPTED_EXCEPTION") {
    console.warn("SECURITY WARNING: Full development-tooling audit FAILED; explicit v0.1.3-only Owner risk acceptance applied. This is NOT a passing full audit.");
  }
} catch (error) {
  console.error("RELEASE SECURITY GATE FAILED:", error.message);
  process.exitCode = 1;
}
