const config = {
  plugins: [
    "@babel/transform-async-to-generator",
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
  config.plugins.push(
    "@babel/proposal-export-default-from",
    "@babel/proposal-export-namespace-from",
    "@babel/transform-modules-commonjs",
    ["add-module-exports", {
      addDefaultProperty: true
    }]
  )
}

module.exports = config
