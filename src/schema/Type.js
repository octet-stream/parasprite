import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "schema/Base"

const isArray = Array.isArray

@proxy({apply})
class Type extends Base {
  constructor(name, description, cb) {
    super(cb)

    this.__name = name
    this.__description = description
    this.__fields = {}
  }

  field(name, type, required = false) {
    this.__name = name
    // this.
  }

  interface() {}

  end() {
    return new GraphQLObjectType({
      name: this.__name,
      description: this.__description,
      fields: this.__fields
    })
  }
}

export default Type
