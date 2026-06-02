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
