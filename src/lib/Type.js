import {isString} from "util"

import {GraphQLObjectType} from "graphql"
import isPlainObject from "lodash.isplainobject"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"
import isGraphQLInterfaceType from "helper/util/isGraphQLInterfaceType"
import checkTypedList from "helper/util/checkTypedList"
import isFunction from "helper/util/isFunction"

import Base from "lib/Base"
import Resolver from "lib/Resolver"

const isArray = Array.isArray

@proxy({apply})
class Type extends Base {
  /**
   * Create custiom GraphQLObjectType using Parasprite chainable API
   *
   * @param {string} name
   * @param {string} description
   * @param {function|function[]} interfaces
   * @param {function} cb (this is the private param)
   */
  constructor(name, description, interfaces, isTypeOf, cb) {
    if (!name) {
      throw new TypeError("Type cannot be anonymous.")
    }

    if (!isString(name)) {
      throw new TypeError("Name should be a string.")
    }

    if (isGraphQLInterfaceType(description) || isArray(description)) {
      [interfaces, isTypeOf, cb, description] = [
        description, interfaces, isTypeOf, undefined
      ]
    }

    if (isFunction(description)) {
      [isTypeOf, cb] = [description, interfaces]
    }

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

    super(name, description, cb)

    // protected members
    this._fields = {}

    // private members
    if (interfaces) this.__interfaces = interfaces
    if (isTypeOf) this.__isTypeOf = isTypeOf
  }

  /**
   * Set a field from given configuration object
   *
   * @private
   */
  __setFieldFromConfig = field => {
    const name = field.name

    if (!name) {
      throw new TypeError("Field config should have \"name\" property.")
    }

    field.type = toListTypeIfNeeded(field.type)

    delete field.name

    if (field.required) {
      field.type = toRequiredTypeIfNeeded(field.type, field.required)

      delete field.required
    }

    this._fields[name] = {
      ...field
    }
  }

  /**
   * Add a field to Type
   *
   * @param {string} name
   * @param {object} type
   * @param {string} description
   * @param {string} deprecationReason – the message that will be displayed as
   *   field deprecation note.
   * @param boolean required – should field be non-null?
   *
   * @return {Type}
   *
   * @access public
   */
  field = (name, type, description, deprecationReason, required) => {
    if (isPlainObject(name)) {
      this.__setFieldFromConfig(name)

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
   * @param {string} name
   * @param {object} type
   * @param {string} description
   * @param {string} deprecationReason – the message that will be displayed as
   *   field deprecation note.
   * @param {boolean} required – should field be non-null?
   * @param {function} handler
   *
   * @return {Resolver}
   */
  __setHandler = (kind, ...args) => {
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

    return resolver[kind](handler)
  }

  resolve = (...args) => this.__setHandler("resolve", ...args)

  subscribe = (...args) => this.__setHandler("subscribe", ...args)

  /**
   * Build and return GraphQLObjectType
   *
   * @return {object}
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
