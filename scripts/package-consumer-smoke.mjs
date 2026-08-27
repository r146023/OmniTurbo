import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(join(tmpdir(), "omniturbo-package-smoke-"));
const packDir = join(temp, "pack");
const consumerDir = join(temp, "consumer");

mkdirSync(packDir, { recursive: true });
mkdirSync(consumerDir, { recursive: true });

try {
  const packedJson = execFileSync(
    npm,
    ["pack", "--json", "--pack-destination", packDir],
    { cwd: root, encoding: "utf8" },
  );
  const packed = JSON.parse(packedJson);
  if (!Array.isArray(packed) || packed.length !== 1 || typeof packed[0]?.filename !== "string") {
    throw new Error(`Unexpected npm pack response: ${packedJson}`);
  }

  const tarball = join(packDir, packed[0].filename);
  writeFileSync(
    join(consumerDir, "package.json"),
    JSON.stringify({ name: "omniturbo-package-smoke", private: true, type: "module" }, null, 2),
  );

  execFileSync(
    npm,
    ["install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
    { cwd: consumerDir, stdio: "inherit" },
  );

  const smokePath = join(consumerDir, "smoke.mjs");
  writeFileSync(
    smokePath,
    `import { Omni } from "@r146023/omniturbo";\n\nconst omni = new Omni();\nconst write = omni.set("package.smoke", { ok: true, source: "packed-artifact" });\nif (!write?.success) throw new Error("Packed consumer write failed");\nconst value = omni.get("package.smoke");\nif (!value || value.ok !== true || value.source !== "packed-artifact") {\n  throw new Error(\`Packed consumer read mismatch: \${JSON.stringify(value)}\`);\n}\nconsole.log("OmniTurbo packed-package native ESM smoke PASS");\n`,
  );

  execFileSync(process.execPath, [smokePath], { cwd: consumerDir, stdio: "inherit" });

  const installedPackage = JSON.parse(
    readFileSync(join(consumerDir, "node_modules", "@r146023", "omniturbo", "package.json"), "utf8"),
  );
  if (installedPackage.name !== "@r146023/omniturbo") {
    throw new Error("Packed consumer installed unexpected package identity");
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
