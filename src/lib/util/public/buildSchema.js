import {join} from "path"

import {isType} from "graphql"

import invariant from "@octetstream/invariant"
import isEmpty from "lodash.isempty"
import merge from "lodash.merge"

import Schema from "../../type/Schema"
import typeOf from "../internal/typeOf"
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
  }
}

function setArgs(t, args, resolverName) {
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

function setFields(t, fields) {
  for (const [name, field] of iterator.entries(fields)) {
    if (!field.ignore) {
      setField(t, name, field)
    }
  }

  return t.end()
}

function readFields(path) {}

function buildSchema(root, options = {}) {
  invariant(
    options && !isPlainObject(options), TypeError,
    "Options should be a plain object. Received %s", typeOf(options)
  )

  options = merge({}, defaults, options)

  const schema = new Schema()

  return schema.end()
}
