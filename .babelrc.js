module.exports = {
  plugins: [
    "@babel/transform-async-to-generator",
    ["@babel/transform-modules-commonjs", {
      mjsStrictNamespace: false
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
