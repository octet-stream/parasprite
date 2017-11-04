import {GraphQLSchema, GraphQLObjectType} from "graphql"

import proxy from "../util/internal/proxy"
import apply from "../util/internal/selfInvokingClass"

import Base from "./Base"
import Type from "./Type"

@proxy({apply})
class Schema extends Base {
  /**
   * Describe GraphQL schema using chainable interface
   */
  constructor() {
    super()

    this.__query = null
    this.__mutation = null
    this.__subscription = null
  }

  /**
   * Define root type on schema
   *
   * @return {Type}
   */
  __setRootType = (rootType, ...options) => {
    const setRootField = field => {
      this[`__${rootType}`] = field

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
   */
  query = (...args) => this.__setRootType("query", ...args)

  /**
   * Define mutation document
   *
   * @see Schema#__setRootType
   */
  mutation = (...args) => this.__setRootType("mutation", ...args)

  /**
   * Define subscription on document
   *
   * @see Schema#__setRootType
   */
  subscription = (...args) => this.__setRootType("subscription", ...args)

  /**
   * Make your GraphQL schema
   *
   * @return {GraphQLSchema}
   */
  end() {
    return new GraphQLSchema({
      query: this.__query,
      mutation: this.__mutation,
      subscription: this.__subscription
    })
  }
}

export default Schema
