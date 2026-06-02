# Recipe: form state

Omni works well for large forms, including per-keystroke state.

## Loose form draft

```ts
omni.set("forms.profile.name", "Ada");
omni.set("forms.profile.email", "ada@example.com");
```

## Governed form fields

```ts
omni.schema("forms.profile.email", {
  type: "string",
  pattern: "^[^@]+@[^@]+\\.[^@]+$",
});

omni.schema("forms.profile.age", {
  type: "integer",
  min: 0,
  max: 130,
  coerce: true,
});
```

## Validate before commit

```ts
const result = omni.set("forms.profile.age", input.value);

if (!result.success) {
  showFieldError(result.issues[0].message);
}
```

## Dry run validation

```ts
const preview = omni.canSet("forms.profile.age", input.value);

if (preview.success) {
  showPreview(preview.value);
}
```

## Submit

```ts
const data = omni.getObj("forms.profile");
```

## Reset

```ts
omni.delete("forms.profile");
omni.setObj(defaultProfileForm, "forms.profile");
```
