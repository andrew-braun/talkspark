// src/routes/+layout.ts
import type { Load } from "@sveltejs/kit"
export const load: Load = ({ url }) => {
	const { pathname } = url

	return {
		pathname,
	}
}
