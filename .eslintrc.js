module.exports = {
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

    "ava/no-ignored-test-files": ["error", {
      files: [
        "src/test/unit/**/*.js"
      ]
    }]
  }
}