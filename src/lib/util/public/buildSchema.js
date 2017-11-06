import {join, basename, extname} from "path"
import {readdirSync, statSync} from "fs"

// import {isType} from "graphql"

import invariant from "@octetstream/invariant"
import isEmpty from "lodash.isempty"
import merge from "lodash.merge"

import Schema from "../../type/Schema"
import Type from "../../type/Type"
import typeOf from "../internal/typeOf"
import isString from "../internal/isString"
import isFunction from "../internal/isFunction"
import iterator from "../internal/objectIterator"
import isPlainObject from "../internal/isPlainObject"

const defaults = {
  query: {
    name: "Query",
    dir: "mutation"
  },
  mutation: {
    name: "Mutation",
    dir: "mutation",
  },
  subscription: {
    name: "Subscription",
    dir: "subscription"
  }
}

function setArgs(t, args) {
  for (const [name, arg] of iterator.entries(args)) {
    t.arg(name, arg.type, arg.required, arg.default || arg.defaultValue)
  }
}

function setField(t, name, options) {
  if (isPlainObject(options.field)) {
    return t.field({...options.field})
  }

  const {subscribe, resolve} = options

  if (isFunction(resolve.handler)) {
    t = t.resolve({
      ...resolve, name, handler: resolve.handler
    })
  }

  if (isFunction(subscribe.handler)) {
    t = t.subscribe({
      ...subscribe, name, handler: subscribe.handler
    })
  }

  if (!isEmpty(options.args)) {
    setArgs(t, options.args, name)
  }

  return t.end()
}

function setFields(name, description, fields) {
  const t = Type(name, description)

  for (const field of iterator.entries(fields)) {
    if (!field.ignore) {
      setField(t, ...field)
    }
  }

  return t.end()
}

function readFields(dir) {
  const files = readdirSync(dir)

  const fields = {}

  for (const file of files) {
    const ext = extname(file)
    const base = basename(file, ext)

    const stat = statSync(join(dir, file))

    if (!stat.isDirectory()) {
      fields[base] = require(dir, file)
    }
  }

  return fields
}

function buildSchema(dir, options = {}) {
  invariant(!dir, "Required a path to the schema root directory.")

  invariant(
    !isString(dir), TypeError,
    "The root directory path should be a string."
  )

  invariant(
    options && !isPlainObject(options), TypeError,
    "Options should be a plain object. Received %s", typeOf(options)
  )

  options = merge({}, defaults, options)

  const schema = new Schema()

  const {query, mutation, subscription} = options

  // Query a;wais required!
  const queryFields = readFields(readFields(query.dir))

  invariant(isEmpty(queryFields), "Expected a Query fields, but got nothig.")

  schema.query(setFields(query.name, query.description, queryFields))

  for (const [kind, root] of iterator({mutation, subscription})) {
    const fields = readFields(join(dir, options.dir))

    if (!isEmpty(fields)) {
      schema[kind](setFields(...root, fields))
    }
  }

  return schema.end()
}

export default buildSchema
