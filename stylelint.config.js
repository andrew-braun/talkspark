/** @type {import('stylelint').Config} */
export default {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-html'],
	ignoreFiles: ['**/.svelte-kit/**', '**/.vercel/**', '**/build/**', '**/node_modules/**'],
	overrides: [
		{
			files: ['**/*.svelte'],
			customSyntax: 'postcss-html',
			rules: {
				'selector-pseudo-class-no-unknown': [
					true,
					{ ignorePseudoClasses: ['global', 'deep'] },
				],
				'selector-class-pattern': null,
				'keyframes-name-pattern': null,
			},
		},
		{
			files: [
				'src/styles/variables.css',
				'src/styles/globals.scss',
				'src/styles/animations.css',
			],
			rules: {
				'declaration-property-value-disallowed-list': null,
				'keyframes-name-pattern': null,
			},
		},
	],
	rules: {
		'declaration-empty-line-before': null,
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
};
