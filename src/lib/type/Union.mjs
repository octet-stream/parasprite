import {GraphQLUnionType, isObjectType} from "graphql"

import invariant from "@octetstream/invariant"

import isPlainObject from "lib/util/internal/isPlainObject"
import omitNullish from "lib/util/internal/omitNullish"
import apply from "lib/util/internal/selfInvokingClass"
import isListOf from "lib/util/internal/isListOf"
import isString from "lib/util/internal/isString"
import getType from "lib/util/internal/getType"
import proxy from "lib/util/internal/proxy"

import Base from "lib/type/Base"
import TypesMatcher from "lib/util/internal/TypesMatcher"

const isArray = Array.isArray

/**
 * Defines a new Unit type
 *
 * @example
 *
 * import {GraphQLString as TString, GraphQLInt as TInt} from "graphql"
 *
 * import Type from "parasprite/Type"
 * import Union from "parasprite/Union"
 *
 * const TBook = Type("Book", "A minimal imformation of a book.")
 *   .field({
 *     name: "author",
 *     type: TString,
 *     required: true
 *   })
 *   .field({
 *     name: "title",
 *     type: TString,
 *     required: true
 *   })
 *   .field({
 *     name: "pages",
 *     type: TInt,
 *     required: true
 *   })
 * .end()
 *
 * const TMovie = Type("Movie", "A minimal imformation of a movie.")
 *   .field({
 *     name: "director",
 *     type: TString,
 *     required: true
 *   })
 *   .field({
 *     name: "title",
 *     type: TString,
 *     required: true
 *   })
 *   .field({
 *     name: "runningTime",
 *     type: TInt,
 *     required: true
 *   })
 * .end()
 *
 * const TSearchable = Union("Searchable", [TBook, TMovie])
 *   .match(({author, pages}) => (author && pages) && TBook)
 *   .match(({director, runningTime}) => (director && runningTime) && TMovie)
 * .end()
 *
 * export default TSearchable
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

      "The name should be a string. Received %s", getType(name)
    )

    super(name, description)

    invariant(!types, "Types list required.")

    invariant(
      !isListOf(types, isObjectType), TypeError,

      "Given list should contain only GraphQLObjectType instances."
    )

    this.__types = Array.from(types)
    this.__astNode = astNode

    this.__matcher = new TypesMatcher()
  }

  /**
   * Match types using the given predicate
   *
   * @param {function} predicate
   * @param {any} [ctx = null]
   *
   * @return {Union}
   */
  match = (predicate, ctx = null) => {
    this.__matcher.use(predicate, ctx)

    return this
  }

  end() {
    return new GraphQLUnionType(omitNullish({
      name: this._name,
      description: this._description,
      types: this.__types,
      resolveType: this.__matcher.exec,
      astNode: this.__astNode
    }))
  }
}

export default Union
