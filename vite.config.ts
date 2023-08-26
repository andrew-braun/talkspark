import { sveltekit } from "@sveltejs/kit/vite"
import tsConfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"
import svg from "@poppanator/sveltekit-svg"

export default defineConfig({
	plugins: [sveltekit(), tsConfigPaths(), svg()],
})
