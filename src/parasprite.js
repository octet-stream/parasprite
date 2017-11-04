import {readdirSync} from "fs"
import {extname, join, basename} from "path"

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

    exports[key] = require(join(__dirname, filename)).default
  }
}

exports.default = require("./Schema").default
