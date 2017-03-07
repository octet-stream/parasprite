import {GraphQLObjectType} from "graphql"

// import isEmpty from "lodash.isempty"
import isFunction from "lodash.isfunction"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "schema/Base"
import Resolver from "schema/Resolver"

@proxy({apply})
class Type extends Base {
  constructor(name, description, cb) {
    super(cb)

    this._name = name
    this._description = description
    this._fields = {}
  }

  /**
   * Add a field to Type
   *
   * @param string name
   * @param object type
   * @param string description
   * @param boolean required – should field be non-null?
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   *
   * @return Type
   */
  field(name, type, required, description, deprecationReason/* , callee */) {
    // if (isFunction(required)) {
    //   [callee, required] = [required, false]
    // }

    if (typeof required === "string") {
      [description, required] = [required, false]
    }

    // Convert given type to GraphQLList if it is an array
    //   Also, mark returned type as non-null if needed
    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this._fields[name] = {
      type, description, deprecationReason
    }

    return this
  }

  /**
   * Add resolver field to current type
   *
   * @param string name
   * @param object type
   * @param function callee
   * @param string description
   * @param boolean required – should field be non-null?
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   *
   * @return Resolver
   */
  // TODO: Merge this method again with Type#field method.
  resolve(name, type, callee, ...other) {
    this.field(name, type, ...other)

    const setResolver = resolver => {
      const field = {
        ...this._fields[name], ...resolver
      }

      this._fields[name] = field

      return this
    }

    const resolver = new Resolver(setResolver)

    return resolver.resolve(callee)
  }

  // interface() {}

  /**
   * Make your type
   *
   * @return object
   */
  end() {
    const objectType = new GraphQLObjectType({
      name: this._name,
      description: this._description,
      fields: this._fields
    })

    return this._callback ? super.end(objectType) : objectType
  }
}

export default Type
