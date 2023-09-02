// src/routes/+layout.js
export const load = ({ url }) => {
	const { pathname } = url

	return {
		pathname,
	}
}
