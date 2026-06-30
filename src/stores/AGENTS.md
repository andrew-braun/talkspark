# stores — Conventions

## Files

| File                | Exports                          | Purpose                                  |
| ------------------- | -------------------------------- | ---------------------------------------- |
| `sparks.svelte.ts`  | `generatedSparks`, `savedSparks` | Spark collections with localStorage sync |
| `loading.svelte.ts` | `loadingState`                   | Global loading flag                      |

## Module-level reactive state

Store files use the `.svelte.ts` extension because they contain Svelte 5 rune-based state at module scope. They are singletons — any component that imports `generatedSparks` gets the same instance.

## loadingState

A plain `$state` object with a single flag:

```ts
export const loadingState = $state({ isLoading: false });
```

Mutate it directly from any component: `loadingState.isLoading = true`. Read it with `loadingState.isLoading`.

## Spark stores

`generatedSparks` and `savedSparks` are both created by `createSparksState(key)`:

1. On initialization (browser only), reads the current value from `localStorage[key]`.
2. Registers a `$effect.root` / `$effect` that writes `items` back to `localStorage` whenever it changes.
3. Returns a reactive object with a `items` getter and `add`, `remove`, and `clear` methods.

| Store             | localStorage key | Contents                                      |
| ----------------- | ---------------- | --------------------------------------------- |
| `generatedSparks` | `all_sparks`     | Every spark generated in this browser session |
| `savedSparks`     | `saved_sparks`   | Sparks the user has bookmarked                |

## Rules

- Always guard `localStorage` and other browser APIs with `browser` from `$app/environment`. These stores run on the server during SSR — accessing `localStorage` there throws.
- Do not use Svelte 4 `writable` or other store primitives. Use `$state` and the factory pattern.
- Mutate sparks through the store methods (`add`, `remove`, `clear`). Do not reach into `items` and mutate the array directly — it will not trigger reactivity.
- If you add a new persisted store, follow the `createSparksState` factory pattern: initialize from localStorage, register a `$effect` to sync back, expose typed methods.
