import {isString} from "util"

import {GraphQLObjectType, isType} from "graphql"

import isPlainObject from "lodash.isplainobject"
import invariant from "@octetstream/invariant"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import getType from "helper/util/getType"
import toListIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredIfNeeded from "helper/util/toRequiredTypeIfNeeded"
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

  // TODO: Implement types extension
  // __extend = parent => {
  //   const fields = parent.getFileds()
  // }

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
  field = options => {
    invariant(
      !isPlainObject(options), TypeError,
      "Expected an object of the field options. Received %s", getType(options)
    )

    const {name, description, required} = options

    invariant(!name, "Field name is required, but not given.")

    invariant(
      !isString(name), TypeError,
      "Field name should be a string. Received %s", getType(name)
    )

    invariant(
      (
        !isType(options.type) ||
        (isArray(options.type) && !isType(options.type[0]))
      ), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    const type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    // TODO: Merge resolvers with the field
    this._fields[name] = {type, description, deprecationReason}

    return this
  }

  __setHandler = (kind, ...args) => {
    const [config] = args

    let name
    let handler
    if (isPlainObject(config)) {
      name = config.name
      handler = config[kind]

      delete config[kind]
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
