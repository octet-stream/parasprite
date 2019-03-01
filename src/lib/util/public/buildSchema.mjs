import path from "path"
import fs from "fs"

import {isType} from "graphql"

import invariant from "@octetstream/invariant"
import isEmpty from "lodash.isempty"
import merge from "lodash.merge"

import Type from "lib/type/Type"
import Schema from "lib/type/Schema"
import typeOf from "lib/util/internal/typeOf"
import isString from "lib/util/internal/isString"
import isFunction from "lib/util/internal/isFunction"
import iterator from "lib/util/internal/objectIterator"
import isPlainObject from "lib/util/internal/isPlainObject"
import findParentModule from "lib/util/internal/findParentModule"

const isArray = Array.isArray

let parent = process.cwd()

// Make paths relative to __filename of the parent module.
if (module && module.parent && isString(module.parent.filename)) {
  parent = path.dirname(findParentModule(module.parent))

  // eslint-disable-next-line no-underscore-dangle
  delete require.cache[__filename]
}

const defaults = {
  query: {
    name: "Query",
    dir: "query",
    description: null
  },
  mutation: {
    name: "Mutation",
    dir: "mutation",
    description: null
  },
  subscription: {
    name: "Subscription",
    dir: "subscription",
    description: null
  }
}

function setArgs(t, args) {
  for (const entry of iterator.entries(args)) {
    const name = entry[0]
    let arg = entry[1]

    if (isArray(arg)) {
      const [type, required] = arg

      arg = {type, required}
    } else if (isType(arg)) {
      arg = {type: arg}
    }

    t.arg({...arg, name})
  }
}

function setField(t, name, options) {
  if (options.resolve && isFunction(options.resolve.handler)) {
    t = t.resolve({...options.resolve, name})
  } else if (options.subscribe && isFunction(options.subscribe.handler)) {
    t = t.subscribe({...options.subscribe, name})
  } else {
    invariant(
      true, TypeError, "Handler and Subscribe function can't be omitted both."
    )
  }

  if (!isEmpty(options.args)) {
    setArgs(t, options.args, name)
  }

  return t.end()
}

function setFields(name, description, fields) {
  const t = Type(name, description)

  for (const [key, field] of iterator.entries(fields)) {
    if (!field.ignore) {
      setField(t, key, field)
    }
  }

  return t.end()
}

function readFields(dir) {
  const files = fs.readdirSync(dir)

  const fields = {}

  for (const file of files) {
    const ext = path.extname(file)
    const base = path.basename(file, ext)

    if (ext === ".js") {
      fields[base] = require(path.join(dir, file))
    }
  }

  return fields
}

function buildSchema(dir, options = {}) {
  invariant(!dir, "Required a path to the schema root directory.")

  invariant(
    !isString(dir), TypeError,
    "The root directory path should be a string. Received %s", typeOf(dir)
  )

  invariant(
    options && !isPlainObject(options), TypeError,
    "Options should be a plain object. Received %s", typeOf(options)
  )

  if (!path.isAbsolute(dir)) {
    dir = path.resolvePath(parent, dir)
  }

  options = merge({}, defaults, options)

  const schema = new Schema()

  const {query, mutation, subscription} = options

  // Query always required!
  const queryFields = readFields(path.join(dir, query.dir))

  invariant(
    isEmpty(queryFields),

    "Expected a Query fields, but got nothig. Path: %s",
    path.join(dir, query.dir)
  )

  schema.query(setFields(query.name, query.description, queryFields))

  for (const [kind, option] of iterator.entries({mutation, subscription})) {
    try {
      const fields = readFields(path.join(dir, option.dir))

      if (!isEmpty(fields)) {
        schema[kind](setFields(option.name, option.description, fields))
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err
      }
    }
  }

  return schema.end()
}

export default buildSchema
