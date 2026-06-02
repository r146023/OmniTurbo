import { Omni } from "../../src";
import { assertDeepEquals, test } from "../_harness";

test("Omni waitFor resolves when path becomes non-excluded", async () => {
  const omni = new Omni();
  const promise = omni.waitFor("ready");
  omni.set("ready", true);
  const result = await promise;
  assertDeepEquals(result, { ready: true });
});

test("Omni waitFor resolves immediately when value already exists", async () => {
  const omni = new Omni();
  omni.set("ready", true);
  const result = await omni.waitFor("ready");
  assertDeepEquals(result, { ready: true });
});

test("Omni waitFor waits for multiple paths", async () => {
  const omni = new Omni();
  const promise = omni.waitFor(["a", "b"]);
  omni.set("a", 1);
  omni.set("b", 2);
  const result = await promise;
  assertDeepEquals(result, { a: 1, b: 2 });
});
