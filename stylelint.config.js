/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-recommended-scss', 'stylelint-config-html/svelte'],
	ignoreFiles: ['**/.svelte-kit/**', '**/build/**', '**/node_modules/**'],
	rules: {
		'declaration-empty-line-before': null,
		// Phase A: warnings only — not CI-blocking (see plan)
		'declaration-property-value-disallowed-list': [
			{
				'/^(color|background|background-color|fill|stroke)$/': [
					/^(?!var\(--|inherit|transparent|currentColor).+/,
				],
				'/^(padding|margin|gap)$/': [/^(?!var\(--|0$)[\d.]+(px|rem|em)$/],
			},
			{ severity: 'warning' },
		],
	},
	overrides: [
		{
			files: ['src/styles/variables.css', 'src/styles/globals.scss', 'src/styles/animations.css'],
			rules: {
				'declaration-property-value-disallowed-list': null,
			},
		},
		// postcss-html treats Button `style="primary"` props as inline CSS (false positive).
		// Component <style> blocks are enabled in checkpoint 4 after prop rename or custom syntax.
		{
			files: ['**/*.svelte'],
			rules: {
				'declaration-property-value-disallowed-list': null,
			},
		},
	],
};
