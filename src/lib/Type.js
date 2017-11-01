import {isString} from "util"

import {GraphQLObjectType, isType} from "graphql"

import isPlainObject from "lodash.isplainobject"
import invariant from "@octetstream/invariant"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import getType from "helper/util/getType"
import toListIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredIfNeeded from "helper/util/toRequiredTypeIfNeeded"
import objectIterator from "helper/iterator/objectIterator"
// import isGraphQLInterfaceType from "helper/util/isGraphQLInterfaceType"
// import checkTypedList from "helper/util/checkTypedList"
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
   * @param {object} options
   * @param {function} cb (this is the private param)
   */
  constructor(...args) {
    let [name, description, options] = args

    if (isPlainObject(name)) {
      options = {...name}
    } else if (isPlainObject(description)) {
      options = {...description, name}
    } else {
      options = {...options, name, description}
    }

    [name, description] = [options.name, options.description]

    invariant(!name, "Type constructor requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name should be a string. Received %s", getType(name)
    )

    super(name, description, args.slice().pop())

    const isTypeOf = options.isTypeOf
    let interfaces = options.interfaces

    if (interfaces && !isArray(interfaces)) {
      interfaces = [interfaces]
    }

    // protected members
    this._fields = {}

    // private members
    this.__interfaces = interfaces
    this.__isTypeOf = isTypeOf

    if (options.extends) {
      this.__extend(options.extends)
    }
  }

  // TODO: Implement types extension
  __extend = parent => {
    invariant(
      !(parent instanceof GraphQLObjectType), TypeError,
      "Parent type should be an instance of GraphQLObjectType."
    )

    const fields = parent.getFields()

    for (const [, field] of objectIterator(fields)) {
      if (isFunction(field.subscribe)) {
        this.subscribe(field)
      } else if (isFunction(field.resolve)) {
        this.resolve(field)
      } else {
        this.field(field)
      }
    }
  }

  /**
   * @private
   */
  __setHandler = (kind, options) => {
    // Create a new field first
    this.field(options)

    const name = options.name

    const setResolver = resolver => {
      const field = {
        ...this._fields[name], ...resolver
      }

      this._fields[name] = field

      return this
    }

    const resolver = new Resolver(setResolver)

    return resolver[kind](options.handler)
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

    let type = options.type

    invariant(
      !isType(isArray(type) ? type[0] : type), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this._fields[name] = {type, description, deprecationReason}

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
