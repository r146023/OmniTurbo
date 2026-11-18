import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Node on Windows cannot execFileSync npm.cmd; call npm's JS CLI through Node instead.
const npm = process.platform === "win32" ? process.execPath : "npm";
const npmArgs = process.platform === "win32"
  ? [process.env.npm_execpath ?? resolve(dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js")]
  : [];
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temp = mkdtempSync(join(tmpdir(), "omniturbo-package-smoke-"));
const packDir = join(temp, "pack");
const consumerDir = join(temp, "consumer");

mkdirSync(packDir, { recursive: true });
mkdirSync(consumerDir, { recursive: true });

try {
  const packedJson = execFileSync(
    npm,
    [...npmArgs, "pack", "--json", "--pack-destination", packDir],
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
    [...npmArgs, "install", "--ignore-scripts", "--no-audit", "--no-fund", tarball],
    { cwd: consumerDir, stdio: "inherit" },
  );

  const smokePath = join(consumerDir, "smoke.mjs");
  writeFileSync(
    smokePath,
    `import { Omni } from "@r146023/omniturbo";\n\nconst omni = new Omni();\nconst write = omni.set("package.smoke", { ok: true, source: "packed-artifact" });\nif (!write?.success) throw new Error("Packed consumer write failed");\nconst value = omni.get("package.smoke");\nif (!value || value.ok !== true || value.source !== "packed-artifact") {\n  throw new Error(\`Packed consumer read mismatch: \${JSON.stringify(value)}\`);\n}\nconst rootA = "package.secure.a";\nconst rootB = "package.secure.b";\nif (!omni.schema(rootA, { type: "string", maxLength: 32 }).success) throw new Error("Schema creation failed");\nconst createdA = omni.set(rootA, "initial", { privateSet: true, owner: "package-a" });\nconst createdB = omni.set(rootB, "other", { privateSet: true, owner: "package-b" });\nif (!createdA.success || !createdB.success || !createdA.setter || !createdB.setter) throw new Error("Private root creation failed");\nlet laterObserverCalled = 0;\nomni.subscribe(rootA, () => { throw new Error("sensitive-observer-details"); });\nomni.subscribe(rootA, () => { laterObserverCalled += 1; });\nconst committed = createdA.setter("committed");\nif (!committed.success || committed.rejected || !committed.changed || committed.value !== "committed") throw new Error("Packed consumer committed result is not truthful");\nif (committed.issues.length !== 1 || committed.issues[0].code !== "OMNI_SUBSCRIBER_CALLBACK_FAILED") throw new Error("Packed consumer missing subscription warning");\nif (JSON.stringify(committed.issues).includes("sensitive-observer-details")) throw new Error("Packed consumer warning leaked observer exception");\nif (omni.get(rootA) !== "committed" || laterObserverCalled !== 1) throw new Error("Packed consumer notifications were not isolated");\nif (omni.set(rootB, "unauthorized", { token: createdA.setter.token }).success !== false) throw new Error("Private root authority crossed");\nif (omni.get(rootB) !== "other") throw new Error("Unrelated protected root changed");\nif (createdA.setter("X".repeat(60)).success !== false) throw new Error("Invalid protected write admitted");\nif (omni.get(rootA) !== "committed" || laterObserverCalled !== 1) throw new Error("Failed write changed state or notified");\nconsole.log("OmniTurbo packed-package native ESM smoke PASS");\n`,
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
