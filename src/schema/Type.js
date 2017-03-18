import {GraphQLObjectType} from "graphql"

import isFunction from "helper/util/isFunction"
import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"
import isGraphQLInterfaceType from "helper/util/isGraphQLInterfaceType"
import checkTypedList from "helper/util/checkTypedList"

import Base from "schema/Base"
import Resolver from "schema/Resolver"

const isArray = Array.isArray

@proxy({apply})
class Type extends Base {
  /**
   * Create custiom GraphQLObjectType using Parasprite chainable API
   *
   * @param string name
   * @param string description
   * @param function|function[] interfaces
   * @param function cb
   */
  constructor(name, description, interfaces, isTypeOf, cb) {
    // if (isFunction(interfaces)) {
    //   [isTypeof, interfaces, isTypeOf] = [interfaces, undefined, undefined]
    // }

    if (interfaces) {
      if (!isArray(interfaces)) {
        interfaces = [interfaces]
      }

      if (!checkTypedList(interfaces, isGraphQLInterfaceType)) {
        throw new TypeError(
          "Interface should be an instance of " +
          "GraphQLInterfaceType or a list of them."
        )
      }
    }

    super(cb)

    // protected members
    this._name = name
    this._description = description
    this._fields = {}

    // private members
    this.__interfaces = interfaces
    this.__isTypeOf = isTypeOf
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
  field(name, type, required, description, deprecationReason) {
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
   * @param function handler
   * @param string description
   * @param boolean required – should field be non-null?
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   *
   * @return Resolver
   */
  resolve(name, type, handler, ...other) {
    this.field(name, type, ...other)

    const setResolver = resolver => {
      const field = {
        ...this._fields[name], ...resolver
      }

      this._fields[name] = field

      return this
    }

    const resolver = new Resolver(setResolver)

    return resolver.resolve(handler)
  }

  /**
   * Build and return GraphQLObjectType
   *
   * @return object
   */
  end() {
    const objectType = new GraphQLObjectType({
      name: this._name,
      description: this._description,
      fields: this._fields,
      interfaces: this.__interfaces
    })

    return this._callback ? super.end(objectType) : objectType
  }
}

export default Type
