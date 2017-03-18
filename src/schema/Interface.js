import {GraphQLInterfaceType} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Type from "schema/Type"

@proxy({apply})
class Interface extends Type {
  constructor(name, description, resolveType) {
    super()

    this._name = name
    this._description = description
    this._fields = {}

    this.__resolveType = resolveType
  }

  end() {
    return new GraphQLInterfaceType({
      name: this._name,
      description: this._description,
      fields: this._fields,
      resolveType: this.__resolveType
    })
  }
}

export default Interface
