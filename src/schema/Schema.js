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
   * Define query document
   *
   * @param string name – query name
   * @param string description – query description
   *
   * @return Type
   */
  query(name, description) {
    /**
     * Add query field to current schema
     *
     * @param object query – query object type
     *
     * @return Schema
     */
    const setQuery = query => {
      // console.log(query)

      this.__query = query

      return this
    }

    const query = new Type(name, description, setQuery)

    return query
  }

  // mutation() {}

  // subscription() {}

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
