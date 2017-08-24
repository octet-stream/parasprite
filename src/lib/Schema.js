import {GraphQLSchema, GraphQLObjectType} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "lib/Base"
import Type from "lib/Type"

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
   * @param {string} name – type name
   * @param {string} description – type description
   *
   * @return {Type}
   */
  __setRootType = (rootType, name, description, interfaces, isTypeOf) => {
    const setField = field => {
      this[`__${rootType}`] = field

      return this
    }

    if (name instanceof GraphQLObjectType) {
      return setField(name)
    }

    return new Type(name, description, interfaces, isTypeOf, setField)
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
