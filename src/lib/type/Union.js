import {GraphQLUnionType, GraphQLObjectType} from "graphql"

import invariant from "@octetstream/invariant"

import isPlainObject from "../util/internal/isPlainObject"
import isObjectType from "../util/internal/isObjectType"
import omitNullish from "../util/internal/omitNullish"
import apply from "../util/internal/selfInvokingClass"
import isString from "../util/internal/isString"
import typeOf from "../util/internal/typeOf"
import proxy from "../util/internal/proxy"

import Base from "./Base"

const isArray = Array.isArray

/**
 * Defines a new Unit type
 *
 * @example
 *
 * const TSearchable = Union("Searchable", [TBook, TMovie])
 *   .match(({author}) => author && TBook)
 *   .match(({director}) => director && TMovie)
 * .end()
 */
@proxy({apply})
class Union extends Base {
  constructor(name, description, types, astNode) {
    if (isPlainObject(name)) {
      [name, description, types] = [
        name.name, name.description, name.types, name.astNode
      ]
    } else if (isArray(description) || isObjectType(description)) {
      [astNode, types, description] = [types, description, undefined]
    }

    invariant(!name, "Union type constructor requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name should be a string. Received %s", typeOf(name)
    )

    super(name, description)

    invariant(!types, "Types list required.")

    this.__types = isArray(types) ? types : [types]
    this.__astNode = astNode

    this.__predicates = []
  }

  __resolveType = async (source, ctx, info) => {
    for (const predicate of this.__predicates) {
      const resolvedType = await predicate(source, ctx, info)

      if (resolvedType instanceof GraphQLObjectType || isString(resolvedType)) {
        return resolvedType
      }
    }
  }

  match = (predicate, ctx = null) => {
    this.__predicates.push(ctx ? predicate.bind(ctx) : predicate)

    return this
  }

  end() {
    return new GraphQLUnionType(omitNullish({
      name: this._name,
      description: this._description,
      types: this.__types,
      resolveType: this.__resolveType
    }))
  }
}

export default Union
