import {
  GraphQLSchema
} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "schema/Base"
import Query from "schema/Query"

@proxy({apply})
class Schema extends Base {
  constructor() {
    super()

    this.__query = null
    this.__mutation = null
    this.__subscription = null
  }

  /**
   * Define query
   */
  query(name, description) {
    const setQuery = query => {
      this.__query = query

      return this
    }

    const query = new Query(name, description, setQuery)

    return query
  }

  /**
   * Generate schema
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
