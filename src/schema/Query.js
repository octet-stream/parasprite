// import {
//   GraphQLList,
//   GraphQLNonNull
// } from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Type from "schema/Type"
import Resolver from "schema/Resolver"

@proxy({apply})
class Query extends Type {
  /**
   * @param string name – field name
   * @param function resolve – field resolver
   * @param Function type – resolver returning type
   */
  field(name, type, description, required, deprecationReason) {
    super.field(name, type, description, required, deprecationReason)

    const setResolver = resolver => {
      this._fields[name] = {
        name, type, description, deprecationReason, ...resolver
      }

      return this
    }

    const resolver = new Resolver(setResolver)

    return resolver
  }
}

export default Query
