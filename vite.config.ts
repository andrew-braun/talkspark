import { sveltekit } from "@sveltejs/kit/vite"
import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [sveltekit(), tsConfigPaths()],
})
