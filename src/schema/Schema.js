import {GraphQLSchema} from "graphql"

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
   * Define field on schema
   *
   * @param string name – field name
   * @param string description – field description
   *
   * @return Type
   */
  __setField(fieldType, name, description) {
    const setField = field => {
      this[`__${fieldType}`] = field

      return this
    }

    const objectType = new Type(name, description, setField)

    return objectType
  }

  /**
   * Define query document
   *
   * @see Schema#__setField
   */
  query(...args) {
    return this.__setField("query", ...args)
  }

  /**
   * Define mutation document
   *
   * @see Schema#__setField
   */
  mutation(...args) {
    return this.__setField("mutation", ...args)
  }

  // subscription(...args) {
  //   return this.__setField("subscription", ...args)
  // }

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
