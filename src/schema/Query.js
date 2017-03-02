import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Type from "schema/Type"
import Resolver from "schema/Resolver"

const isArray = Array.isArray

@proxy({apply})
class Query extends Type {
  constructor(name, description, cb = null) {
    super(name, description, cb)

    // this.__name = name || "Query"
    // this.__description = description
    // this.__fields = {}
  }

  /**
   * @param string name – field name
   * @param function resolve – field resolver
   * @param Function type – resolver returning type
   */
  field = (name, type, required = false) => {
    if (isArray(type)) {
      type = new GraphQLList(type[0])
    }

    if (required) {
      type = new GraphQLNonNull(type)
    }

    const setResolver = resolver => {
      this.__fields[name] = {
        type, ...resolver
      }

      return this
    }

    const resolver = new Resolver(setResolver)

    return resolver
  }
}

export default Query
