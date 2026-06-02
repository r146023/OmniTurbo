# Timeline

The timeline records committed changes.

```ts
omni.set("x", 1);
omni.set("x", 2);

console.log(omni.timeline.list());
```

Typical entry:

```ts
{
  timestamp: 1710000000000,
  path: "x",
  oldValue: 1,
  newValue: 2,
  action: "updated",
  index: 2
}
```

## Timeline actions

```ts
"created"
"updated"
"deleted"
"undo"
"redo"
```

## Suppress timeline per write

```ts
omni.set("x", 1, { suppressTimeline: true });
```

## Disable/limit timeline

The `Timeline` object exposes:

```ts
omni.timeline.enabled = false;
omni.timeline.maxSize = 500;
```

## Timeline vs subscriptions

Timeline is historical inspection.

Subscriptions are live reactions.

Timeline should not be used to drive UI unless you are specifically building a log/history panel.
