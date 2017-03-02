import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from "graphql"

// import isEmpty from "lodash.isempty"

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
    const TObjectType = new GraphQLObjectType({
      name: this.__name,
      description: this.__description,
      fields: this.__fields
    })

    return this._callback ? super.end(TObjectType) : TObjectType
  }
}

export default Type
