module.exports = {
  parser: "babel-eslint",
  settings: {
    "import/resolver": {
      "babel-module": {
        cwd: __dirname,
        root: [
          "src"
        ]
      }
    }
  },
  plugins: [
    "ava"
  ],
  extends: [
    "@octetstream",
    "plugin:ava/recommended"
  ],
  rules: {
    "no-void": 0,
    indent: ["error", 2, {
      MemberExpression: "off"
    }],
    "operator-linebreak": ["error", "after", {
      overrides: {
        "+": "ignore",
        "?": "before",
        ":": "before"
      }
    }],

    "ava/no-ignored-test-files": 0,
  }
}
