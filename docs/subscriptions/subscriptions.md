# Subscriptions

Subscriptions react to committed state changes.

## Direct subscription

```ts
const unsubscribe = omni.subscribe("settings.theme", (path, value, oldValue) => {
  console.log(path, value, oldValue);
});

omni.set("settings.theme", "dark");
unsubscribe();
```

## Tree subscription

```ts
omni.subscribeTree("entities.node_1.meta", (root, changedPath, value, oldValue) => {
  console.log(root, changedPath, value);
});

omni.set("entities.node_1.meta.width", 250);
```

## Global subscription

```ts
omni.subscribeGlobal((path, value, oldValue) => {
  console.log("changed", path);
});
```

## Parent notifications

When parent notifications are enabled, a subscriber on `root` can be notified when `root.child` changes.

```ts
omni.subscribe("root", (_path, value) => {
  console.log(value); // rebuilt object
});

omni.set("root.child", 1);
```

Disable:

```ts
omni.setParentNotifications(false);
```

## Invalid writes do not notify

```ts
omni.schema("x", { type: "number" });
omni.subscribe("x", () => console.log("changed"));

omni.set("x", "bad"); // no subscription call
```

## Batch behavior

Batch suppresses subscriptions by default:

```ts
omni.batch(() => {
  omni.set("x", 1);
});
```

Request notifications:

```ts
omni.batch(() => {
  omni.set("x", 1);
}, undefined, { notify: true });
```

## Subscriber callback failures after commit

Subscriptions run synchronously **after** an admitted mutation has committed. A synchronous exception thrown by any direct, global, tree, or parent-path subscriber is isolated from the other eligible subscribers and does not roll back the committed value or turn the already successful write into a failed transaction.

A committed write still returns `OmniResult.success === true`, `rejected === false`, and `changed === true`. The existing `issues` array contains one sanitized `OMNI_SUBSCRIBER_CALLBACK_FAILED` warning per failed callback, with `source: "subscription"`, the changed path, and `details.kind` identifying `direct`, `global`, `tree`, or `parent`. Observer exception text, stack traces, values, and private write tokens are not copied into the result.

```ts
const omni = new Omni();
omni.subscribe("settings.theme", () => { throw new Error("observer failed"); });
omni.subscribe("settings.theme", (_path, value) => {
  console.log("still notified of", value);
});
const result = omni.set("settings.theme", "dark");
// result.success === true; omni.get("settings.theme") === "dark"
// result.issues[0].code === "OMNI_SUBSCRIBER_CALLBACK_FAILED"
```

Existing notification argument shapes, delivery order, parent-notification opt-out, unsubscribe, and `once`/throttle behavior are preserved. A subscriber invoked with `once` counts as invoked even if it throws; likewise, a failed throttled invocation counts as an attempted delivery. The same rule applies to committed `undo()` notifications and to batch operations with `{ notify: true }`.

The isolation applies **only to synchronously thrown subscriber callback exceptions**. It does not supervise Promise rejections returned by asynchronous subscribers, create a logging subsystem, or change separate alert/waiter behavior. Pre-commit coercion, schema validation, and privacy checks still retain their original failure behavior: invalid/unauthorized writes do not commit or publish change notifications.
