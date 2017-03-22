import {GraphQLObjectType} from "graphql"
import isPlainObject from "lodash.isplainobject"

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

  __setField(field) {
    const name = field.name

    if (!name) {
      throw new TypeError("Field config should have \"name\" property.")
    }

    delete field.name

    this._fields[name] = {
      ...field
    }
  }

  /**
   * Add a field to Type
   *
   * @param string name
   * @param object type
   * @param string description
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   * @param boolean required – should field be non-null?
   *
   * @return Type
   */
  field(name, type, description, deprecationReason, required) {
    if (isPlainObject(name)) {
      this.__setField(name)

      return this
    }

    if (typeof description === "boolean") {
      [required, description, deprecationReason] = [
        description, undefined, undefined
      ]
    } else if (typeof deprecationReason === "boolean") {
      [required, deprecationReason] = [deprecationReason, undefined]
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
   * @param string description
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   * @param boolean required – should field be non-null?
   * @param function handler
   *
   * @return Resolver
   */
  resolve(...args) {
    const [config] = args

    let name
    let handler
    if (isPlainObject(config)) {
      name = config.name
      handler = config.handler

      delete config.handler
    } else {
      name = config
      handler = args.pop()
    }

    this.field(...args)

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
      interfaces: this.__interfaces,
      isTypeOf: this.__isTypeOf
    })

    return this._callback ? super.end(objectType) : objectType
  }
}

export default Type
