export default {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'type-enum': [0],
	},
	parserPreset: {
		parserOpts: {
			headerPattern: /^([\w-]+):\s*(.+)$/,
			headerCorrespondence: ['type', 'subject'],
		},
	},
};
