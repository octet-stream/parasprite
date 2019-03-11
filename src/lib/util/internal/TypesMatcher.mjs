import invariant from "@octetstream/invariant"

import {isObjectType} from "graphql"

import isFunction from "lib/util/internal/isFunction"
import getType from "lib/util/internal/getType"

const isArray = Array.isArray

class TypesMatcher {
  constructor(matchers = undefined) {
    this.__matchers = []

    if (isArray(matchers)) {
      matchers.forEach(matcher => this.use(matcher))
    }
  }

  /**
   * Add another matcher to use as matcher
   *
   * @param (Function) matcher
   *
   * @return {TypesMatcher}
   */
  use(matcher, ctx = null) {
    invariant(
      !isFunction(matcher), TypeError,

      "Type matcher must be a function. Received %s", getType(matcher)
    )

    this.__matchers.push(ctx ? matcher.bind(ctx) : matcher)

    return this
  }

  /**
   * Executes types matching.
   * Used as the as the resolveType function at Union and Interface.
   *
   * @return {GraphQLObjectType | null}
   */
  exec = async (source, ctx, info) => {
    for (const matcher of this.__matchers) {
      const resolvedType = await matcher(source, ctx, info)

      if (isObjectType(resolvedType)) {
        return resolvedType
      }
    }

    return null
  }
}

export default TypesMatcher
