import invariant from "@octetstream/invariant"

import {isObjectType} from "graphql"

import isFunction from "lib/util/internal/isFunction"
import isString from "lib/util/internal/isString"
import typeOf from "lib/util/internal/typeOf"

const isArray = Array.isArray

class TypesMatcher {
  constructor(matchers = undefined) {
    this.__predicates = []

    if (isArray(matchers)) {
      this.use(matchers)
    }
  }

  /**
   * Add another predicate to use as matcher
   *
   * @param (Function) predicate
   *
   * @return {TypesMatcher}
   */
  use = (predicate, ctx = null) => {
    invariant(
      !isFunction(predicate), TypeError,

      "Type matcher must be a function. Received %s", typeOf(predicate)
    )

    this.__predicates.push(ctx ? predicate.bind(ctx) : predicate)

    return this
  }

  /**
   * Executes types matching.
   * Used as the as the resolveType function at Union and Interface.
   *
   * @return {GraphQLObjectType | null}
   */
  exec = async (source, ctx, info) => {
    for (const predicate of this.__predicates) {
      const resolvedType = await predicate(source, ctx, info)

      if (isObjectType(resolvedType) || isString(resolvedType)) {
        return resolvedType
      }
    }

    return null
  }
}

export default TypesMatcher
