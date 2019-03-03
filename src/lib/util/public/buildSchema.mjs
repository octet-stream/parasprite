import p from "path"
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

const isArray = Array.isArray

const EXTENSIONS = [".js", ".mjs"]

const defaults = {
  root: process.cwd(),
  query: {
    name: "Query",
    path: "query",
    description: null
  },
  mutation: {
    name: "Mutation",
    path: "mutation",
    description: null
  },
  subscription: {
    name: "Subscription",
    path: "subscription",
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

function setDefinition(t, name, options) {
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

function setDefinitions(name, description, fields) {
  const t = Type(name, description)

  for (const [key, field] of iterator.entries(fields)) {
    if (!field.ignore) {
      setDefinition(t, key, field)
    }
  }

  return t.end()
}

function readDefinitions(path) {
  const files = fs.readdirSync(path)

  const fields = {}

  for (const file of files) {
    const ext = p.extname(file)
    const base = p.basename(file, ext)

    if (EXTENSIONS.includes(ext)) {
      fields[base] = require(p.join(path, file))
    }
  }

  return fields
}

/**
 * Build a new GraphQL schema using definitions from given path(s).
 *
 * @return {parasprite.Schema}
 */
function buildSchema(params = {}) {
  invariant(
    !isPlainObject(params), TypeError,

    "Expected parameters as an object. Received ", typeOf(params)
  )

  const {root, ...fields} = merge({}, defaults, params)

  invariant(
    !isString(root), TypeError,

    "Root path must be a string. Received", typeOf(root)
  )

  const schema = new Schema()

  for (const [kind, field] of iterator.entries(fields)) {
    const path = p.resolve(root, field.path)
    const definitions = readDefinitions(path)

    if (!isEmpty(definitions)) {
      schema[kind](setDefinitions(field.name, field.description, definitions))
    } else if (kind === "query") {
      invariant(
        true, "Expected a Query definitions, but got nothig. Path: %", path
      )
    }
  }

  return schema.end()
}

export default buildSchema
