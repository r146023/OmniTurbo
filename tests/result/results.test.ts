import { failResult, mergeResults, okResult } from "../../src/result/resultFactories";
import { assert, assertEquals, test } from "../_harness";

test("okResult creates successful result with defaults", () => {
  const result = okResult({ action: "set", path: "x", value: 1 });
  assert(result.success);
  assertEquals(result.rejected, false);
  assertEquals(result.changed, false);
  assertEquals(result.issues.length, 0);
});

test("failResult creates rejected result", () => {
  const result = failResult({
    action: "set",
    path: "x",
    issues: [{ code: "ERR", severity: "error", path: "x", message: "bad", source: "internal" }],
  });
  assert(!result.success);
  assert(result.rejected);
  assertEquals(result.changed, false);
});

test("mergeResults succeeds when all children succeed", () => {
  const result = mergeResults("batch", "root", [
    okResult({ action: "set", path: "a", changed: true }),
    okResult({ action: "set", path: "b", changed: false }),
  ]);
  assert(result.success);
  assert(result.changed);
  assertEquals(result.children?.length, 2);
});

test("mergeResults fails when any child fails and aggregates issues", () => {
  const result = mergeResults("batch", "root", [
    okResult({ action: "set", path: "a", changed: true }),
    failResult({ action: "set", path: "b", issues: [{ code: "BAD", severity: "error", path: "b", message: "bad", source: "schema" }] }),
  ]);
  assert(!result.success);
  assert(result.rejected);
  assertEquals(result.issues.length, 1);
});
