const config = {
  plugins: [
    "@babel/proposal-export-default-from",
    "@babel/proposal-export-namespace-from",
    "@babel/transform-async-to-generator",
    "@babel/syntax-import-meta",
    "@babel/transform-modules-commonjs",
    ["module-resolver", {
      root: ["src"],
    }],
    ["@babel/proposal-decorators", {
      legacy: true
    }],
    ["@babel/proposal-class-properties", {
      loose: true
    }],
    ["@babel/proposal-object-rest-spread", {
      useBuiltIns: true
    }]
  ]
}

module.exports = config
