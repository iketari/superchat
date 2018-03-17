module.exports = {
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 8,
		"sourceType": "module"
	},
	"env": {
		"browser": true,
		"node": true,
		"es6": true,
		"mocha": true,
		"jasmine": true
	},
	"rules": {
		"camelcase": 1,
		"no-tabs": 0,
		"indent": ["warn", "tab"],
		"quotes": ["error", "single", {"allowTemplateLiterals": true}],
		"max-len": ["error", {
			"code": 95,
			"ignoreComments": true,
			"ignoreTrailingComments": true,
			"ignoreUrls": true,
			"ignoreStrings": true,
			"ignoreTemplateLiterals": true
		}],
		"strict": [0, "global"],
		"no-console": 0,
		"no-unused-vars": 1,
	},
	"globals": {
		"assert": true,
		"sinon": true,
		"browser": true,
	}
};
