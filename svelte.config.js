import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	compilerOptions: {
		experimental: {
			async: true,
		},
	},

	kit: {
		adapter: adapter(),
		alias: {
			components: 'src/components',
			stores: 'src/stores',
			styles: 'src/styles',
			ts: 'src/ts',
			lib: 'src/lib',
		},
		experimental: {
			remoteFunctions: true,
		},
	},
};

export default config;
