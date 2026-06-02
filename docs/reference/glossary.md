# Glossary

## Alias

A named path root, such as `@selected` pointing to `entities.node_1`.

## Alert

A post-commit side effect intended for notable events or conditional reactions.

## Atomic object

An object stored as one value at one path. Its children are not addressable through dot notation.

## Batch

A group of writes, usually for initialization, that can suppress per-path side effects.

## Coercer

A function that transforms an incoming value before validation/commit.

## Datatype

Reusable validation/coercion behavior such as `number`, `boolean`, or `Amber.color.hex`.

## Governed path

A path controlled by schema and/or privacy rules.

## Loose path

A path with no schema/privacy enforcement.

## OmniIssue

A structured message describing validation/privacy/internal problems.

## OmniResult

The structured result returned by operations like `set`, `setObj`, and `delete`.

## Private path

A path that cannot be updated through normal `set()` calls after creation.

## Private setter

A function returned from private writes that carries the write token for that private path/tree.

## Schema

A path contract defining type, validation, coercion, privacy, history, and child rules.

## Timeline

Global chronological list of committed changes.

## Tree subscription

A subscription to changes under a path prefix.

## Write token

Capability object that authorizes writes to private paths.
