import {GraphQLSchema, GraphQLObjectType} from "graphql"

import proxy from "lib/util/internal/proxy"
import apply from "lib/util/internal/selfInvokingClass"
import omitNullish from "lib/util/internal/omitNullish"

import Base from "./Base"
import Type from "./Type"

const isArray = Array.isArray

/**
 * @api public
 */
@proxy({apply})
class Schema extends Base {
  /**
   * Describe GraphQL schema using chainable interface
   */
  constructor({types = []} = {}) {
    super()

    /**
     * @private
     */
    this.__fields = {}

    /**
     * @private
     */
    this.__types = isArray(types) ? Array.from(types) : [types]
  }

  /**
   * Define root type on schema
   *
   * @return {Type}
   *
   * @private
   */
  __setRootType = (rootType, ...options) => {
    const setRootField = field => {
      this.__fields[rootType] = field

      return this
    }

    if (options[0] instanceof GraphQLObjectType) {
      return setRootField(options[0])
    }

    return new Type(...options, setRootField)
  }

  /**
   * Define query document
   *
   * @see Schema#__setRootType
   *
   * @public
   */
  query = (...args) => this.__setRootType("query", ...args)

  /**
   * Define mutation document
   *
   * @see Schema#__setRootType
   *
   * @public
   */
  mutation = (...args) => this.__setRootType("mutation", ...args)

  /**
   * Define subscription on document
   *
   * @see Schema#__setRootType
   *
   * @public
   */
  subscription = (...args) => this.__setRootType("subscription", ...args)

  /**
   * Make your GraphQL schema
   *
   * @return {GraphQLSchema}
   *
   * @public
   */
  end() {
    return new GraphQLSchema(omitNullish({
      ...this.__fields,

      types: this.__types.length > 0 ? this.__types : null
    }))
  }
}

export default Schema
