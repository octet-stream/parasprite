const {readdirSync} = require("fs")
const {extname, join, basename} = require("path")

const dir = readdirSync(__dirname)

/**
 * Dynamically export all public files from __dirname
 * to allow them require using destructuring assignment,
 *
 * @example
 *
 * // Using CommonJS syntax
 * const {Type, Input, Interface, makeSchema, Schema} = require("parasprite")
 *
 * // Using ES modules syntax
 * import Schema, {Type, Input, Interface, makeSchema} from "parasprite"
 */
for (const filename of dir) {
  const ext = extname(filename)

  if (ext === ".js" && filename !== basename(__filename)) {
    const key = basename(filename, ext)

    exports[key] = require(join(__dirname, filename))
  }
}

exports.default = require("./Schema")

// Mark this module as ES6 thing for Babel
Object.defineProperty(exports, "__esModule", {
  value: true,
  enumerable: false,
  writable: false
})
