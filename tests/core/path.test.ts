import { getParentPaths, getPathParts, getRelativePath, isChildPath, joinPath, normalizePath, wildcardScore, wildcardToRegExp } from "../../src/core/path";
import { assert, assertDeepEquals, assertEquals, assertThrows, test } from "../_harness";

test("normalizePath trims dots, spaces, and duplicate separators", () => {
  assertEquals(normalizePath(" .user..profile.name. "), "user.profile.name");
});

test("normalizePath rejects empty paths", () => {
  assertThrows(() => normalizePath(" ... "));
});

test("joinPath skips empty parts and normalizes duplicate dots", () => {
  assertEquals(joinPath("user", undefined, "", "profile", "name"), "user.profile.name");
});

test("getPathParts splits normalized paths", () => {
  assertDeepEquals(getPathParts("user..profile.name"), ["user", "profile", "name"]);
});

test("isChildPath treats root as its own child and detects descendants", () => {
  assert(isChildPath("user.profile", "user.profile"));
  assert(isChildPath("user.profile", "user.profile.name"));
  assert(!isChildPath("user.profile", "user.profiles.name"));
});

test("getRelativePath returns child suffix when path belongs to root", () => {
  assertEquals(getRelativePath("user.profile", "user.profile.name.first"), "name.first");
  assertEquals(getRelativePath("user.profile", "user.profile"), "");
});

test("getParentPaths returns nearest parent first", () => {
  assertDeepEquals(getParentPaths("a.b.c.d"), ["a.b.c", "a.b", "a"]);
});

test("wildcardToRegExp matches one segment per wildcard", () => {
  const re = wildcardToRegExp("entities.*.meta.width");
  assert(re.test("entities.node1.meta.width"));
  assert(!re.test("entities.node1.deep.meta.width"));
});

test("wildcardScore prefers concrete patterns over wildcard-heavy patterns", () => {
  assert(wildcardScore("entities.node1.meta.width") > wildcardScore("entities.*.meta.width"));
});
