import { PrivacyRegistry } from "../../src/privacy/PrivacyRegistry";
import { createPrivateSetter } from "../../src/privacy/writeTokens";
import { assert, assertEquals, test } from "../_harness";

test("PrivacyRegistry allows writes to unguarded paths", () => {
  const privacy = new PrivacyRegistry();
  assert(privacy.canWrite("free.path").allowed);
});

test("PrivacyRegistry blocks private path without token", () => {
  const privacy = new PrivacyRegistry();
  privacy.createRule("private.path", { owner: "node1" });
  const check = privacy.canWrite("private.path");
  assert(!check.allowed);
  assertEquals(check.issue?.code, "OMNI_PRIVATE_PATH");
});

test("PrivacyRegistry allows private root and child writes with token", () => {
  const privacy = new PrivacyRegistry();
  const token = privacy.createRule("private.path", { owner: "node1", canWriteChildren: true });
  assert(privacy.canWrite("private.path", token).allowed);
  assert(privacy.canWrite("private.path.child", token).allowed);
});

test("PrivacyRegistry blocks child writes when token cannot write children", () => {
  const privacy = new PrivacyRegistry();
  const token = privacy.createRule("private.path", { canWriteChildren: false });
  assert(privacy.canWrite("private.path", token).allowed);
  assert(!privacy.canWrite("private.path.child", token).allowed);
});

test("PrivacyRegistry delete policies are enforced", () => {
  const privacy = new PrivacyRegistry();
  const token = privacy.createRule("private.path", { deletePolicy: "owner" });
  assert(!privacy.canDelete("private.path").allowed);
  assert(privacy.canDelete("private.path", token).allowed);
});

test("PrivacyRegistry never delete policy blocks owner too", () => {
  const privacy = new PrivacyRegistry();
  const token = privacy.createRule("private.path", { deletePolicy: "never" });
  assert(!privacy.canDelete("private.path", token).allowed);
});

test("createPrivateSetter writes root and child paths with token", () => {
  const token = { id: "tok", rootPath: "root", canWriteChildren: true, created: Date.now() };
  const writes: Array<{ path: string; value: unknown; tokenId?: string }> = [];
  const setter = createPrivateSetter(token, (path, value, options) => {
    writes.push({ path, value, tokenId: options?.token?.id });
    return { success: true, action: "set", path, value, changed: true, issues: [] };
  });
  setter(1);
  setter("child.value", 2);
  assertDeepWritable(writes);
});

function assertDeepWritable(writes: Array<{ path: string; value: unknown; tokenId?: string }>): void {
  assertEquals(writes[0].path, "root");
  assertEquals(writes[0].value, 1);
  assertEquals(writes[0].tokenId, "tok");
  assertEquals(writes[1].path, "root.child.value");
  assertEquals(writes[1].value, 2);
  assertEquals(writes[1].tokenId, "tok");
}
