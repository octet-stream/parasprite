const config = {
  plugins: [
    "@babel/proposal-export-default-from",
    "@babel/proposal-export-namespace-from",
    "@babel/transform-async-to-generator",
    "@babel/syntax-import-meta",
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

if (!process.env.BABEL_ESM) {
  config.plugins.push("@babel/transform-modules-commonjs")
}

module.exports = config
