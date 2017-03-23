import {GraphQLInterfaceType} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import isFunction from "helper/util/isFunction"

import Type from "schema/Type"

@proxy({apply})
class Interface extends Type {
  /**
   * Create custiom GraphQLInterfaceType using Parasprite chainable API
   *
   * @param string name
   * @param string description
   * @param function resolveType
   */
  constructor(name, description, resolveType) {
    if (isFunction(description)) {
      [resolveType, description] = [description, undefined]
    }

    super(name, description)

    // Protexted
    this._fields = {}

    // Private
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
