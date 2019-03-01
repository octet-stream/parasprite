module.exports = {
  parser: "babel-eslint",
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

    "ava/no-ignored-test-files": ["error", {
      files: [
        "src/test/unit/**/*.mjs"
      ]
    }]
  }
}
