import invariant from "@octetstream/invariant"

import {isObjectType} from "graphql"

import isFunction from "lib/util/internal/isFunction"
import isString from "lib/util/internal/isString"
import typeOf from "lib/util/internal/typeOf"

const isArray = Array.isArray

class TypesMatcher {
  constructor(matchers = null) {
    this.__matchers = []

    if (isArray(matchers)) {
      this.use(matchers)
    }
  }

  use = (matcher, ctx = null) => {
    invariant(
      !isFunction(matcher), TypeError,

      "Type matcher must be a function. Received %s", typeOf(matcher)
    )

    this.__matchers.push(ctx ? matcher.bind(ctx) : matcher)

    return this
  }

  exec = async (source, ctx, info) => {
    for (const matcher of this.__matchers) {
      const resolvedType = await matcher(source, ctx, info)

      if (isObjectType(resolvedType) || isString(resolvedType)) {
        return resolvedType
      }
    }

    return null
  }
}

export default TypesMatcher
