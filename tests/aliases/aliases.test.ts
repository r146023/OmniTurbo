import { AliasRegistry } from "../../src/aliases/AliasRegistry";
import { assertDeepEquals, assertEquals, assertThrows, test } from "../_harness";

test("AliasRegistry stores aliases with @ prefix", () => {
  const aliases = new AliasRegistry();
  aliases.set("user", "entities.node1");
  assertEquals(aliases.resolve("@user.meta.width"), "entities.node1.meta.width");
});

test("AliasRegistry accepts explicit @ aliases", () => {
  const aliases = new AliasRegistry();
  aliases.set("@selected", "entities.node2");
  assertEquals(aliases.resolve("@selected.meta.height"), "entities.node2.meta.height");
});

test("AliasRegistry normalizes non-alias paths", () => {
  const aliases = new AliasRegistry();
  assertEquals(aliases.resolve(" .a..b. "), "a.b");
});

test("AliasRegistry throws for unknown aliases", () => {
  const aliases = new AliasRegistry();
  assertThrows(() => aliases.resolve("@missing.path"));
});

test("AliasRegistry can remove and list aliases", () => {
  const aliases = new AliasRegistry();
  aliases.set("one", "a.b");
  aliases.set("two", "c.d");
  assertDeepEquals(aliases.list(), { "@one": "a.b", "@two": "c.d" });
  aliases.remove("one");
  assertThrows(() => aliases.resolve("@one.x"));
});
