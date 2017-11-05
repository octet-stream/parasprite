import {GraphQLObjectType, isType} from "graphql"

import invariant from "@octetstream/invariant"
import omit from "lodash.omitby"

import typeOf from "../util/internal/typeOf"
import proxy from "../util/internal/proxy"
import isString from "../util/internal/isString"
import isFunction from "../util/internal/isFunction"
import omitNullish from "../util/internal/omitNullish"
import apply from "../util/internal/selfInvokingClass"
import isPlainObject from "../util/internal/isPlainObject"
import objectIterator from "../util/internal/objectIterator"
import toListIfNeeded from "../util/internal/toListTypeIfNeeded"
import toRequiredIfNeeded from "../util/internal/toRequiredTypeIfNeeded"

import Base from "./Base"
import Resolver from "./Resolver"

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
      "The name should be a string. Received %s", typeOf(name)
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

  __extendHandler = (kind, options) => {
    const predicate = (_, name) => name === kind

    const resolver = this.__setHandler(kind, omit({
      ...options, handler: options[kind]
    }, predicate))

    const args = options.args

    for (const arg of args) {
      resolver.arg(arg.name, arg.type, arg.description, args.defaultValue)
    }

    resolver.end()
  }

  __extend = parent => {
    invariant(
      !(parent instanceof GraphQLObjectType), TypeError,
      "Parent type should be an instance of GraphQLObjectType."
    )

    const fields = parent.getFields()

    for (const field of objectIterator(fields)) {
      if (isFunction(field.subscribe)) {
        this.__extendHandler("subscribe", field)
      } else if (isFunction(field.resolve)) {
        this.__extendHandler("resolve", field)
      } else {
        this.field({...field})
      }
    }
  }

  /**
   * @private
   */
  __setHandler = (kind, options) => {
    const setResolver = resolver => {
      this.field(options) // Set a field before add resolver

      const field = this._fields[options.name]

      this._fields[options.name] = {
        ...field, ...resolver
      }

      return this
    }

    let resolver = new Resolver(setResolver)

    resolver = resolver[kind](options.handler)

    return options && options.noArgs ? resolver.end() : resolver
  }

  /**
   * Add a field to Type
   *
   * @param {object} options
   *   + {string} name
   *   + {object | [object, boolean]} type
   *   + {string} description
   *   + {string} deprecate – the message that will be displayed as
   *     field deprecation note.
   *   + boolean required – should field be non-null?
   *
   * @return {Type}
   *
   * @access public
   */
  field = options => {
    invariant(
      !isPlainObject(options), TypeError,
      "Expected an object of the field options. Received %s", typeOf(options)
    )

    const {name, description, required} = options

    invariant(!name, "Field name is required, but not given.")

    invariant(
      !isString(name), TypeError,
      "Field name should be a string. Received %s", typeOf(name)
    )

    let type = options.type

    invariant(
      !isType(isArray(type) ? type[0] : type), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this._fields[name] = omitNullish({type, description, deprecationReason})

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
    const objectType = new GraphQLObjectType(omitNullish({
      name: this._name,
      description: this._description,
      fields: this._fields,
      interfaces: this.__interfaces,
      isTypeOf: this.__isTypeOf
    }))

    return this._callback ? super.end(objectType) : objectType
  }
}

export default Type
