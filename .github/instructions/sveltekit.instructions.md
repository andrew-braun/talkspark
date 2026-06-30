---
applyTo: 'src/routes/**/*.svelte,src/routes/**/*.ts,src/components/**/*.svelte,src/stores/**/*.ts,src/lib/client/**/*.ts,src/styles/**/*,src/ts/**/*.ts'
---

# SvelteKit frontend instructions

- Follow the existing SvelteKit and Svelte 4 patterns already present in the repo instead of introducing newer framework conventions opportunistically.
- Keep browser-only logic behind the existing browser guards from `$app/environment`.
- Reuse the existing store and component flow before adding new top-level state or derived abstractions.
- Preserve the current CSS approach: SCSS in component styles, shared variables in `src/styles/`, no utility CSS framework.
- Use the existing path aliases from `tsconfig.json` when they keep imports clearer than long relative paths.
- When changing spark rendering or actions, check the interaction between the component, the store, and localStorage persistence.
- Validate Svelte or TypeScript changes with `pnpm check`.
