import {GraphQLSchema, GraphQLObjectType} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "schema/Base"
import Type from "schema/Type"

@proxy({apply})
class Schema extends Base {
  constructor() {
    super()

    this.__query = null
    this.__mutation = null
    this.__subscription = null
  }

  /**
   * Define root type on schema
   *
   * @param string name – type name
   * @param string description – type description
   *
   * @return Type
   */
  __setRootType(rootType, name, description) {
    const setField = field => {
      this[`__${rootType}`] = field

      return this
    }

    if (name instanceof GraphQLObjectType) {
      return setField(name)
    }

    return new Type(name, description, undefined, undefined, setField)
  }

  /**
   * Define query document
   *
   * @see Schema#__setRootType
   */
  query(...args) {
    return this.__setRootType("query", ...args)
  }

  /**
   * Define mutation document
   *
   * @see Schema#__setRootType
   */
  mutation(...args) {
    return this.__setRootType("mutation", ...args)
  }

  /**
   * Make your GraphQL schema
   *
   * @return GraphQLSchema
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
