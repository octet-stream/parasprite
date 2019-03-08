import {isType} from "graphql"

import invariant from "@octetstream/invariant"

import proxy from "lib/util/internal/proxy"
import typeOf from "lib/util/internal/typeOf"
import isString from "lib/util/internal/isString"
import isFunction from "lib/util/internal/isFunction"
import omitNullish from "lib/util/internal/omitNullish"
import apply from "lib/util/internal/selfInvokingClass"
import isPlainObject from "lib/util/internal/isPlainObject"
import toListTypeIfNeeded from "lib/util/internal/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "lib/util/internal/toRequiredTypeIfNeeded"

import Base from "./Base"

const isArray = Array.isArray

const kinds = {
  RESOLVE: "resolve",
  SUBSCRIBE: "subscribe"
}

/**
 * Implements resolver field on GraphQLObjectType
 *
 * @api private
 */
@proxy({apply})
class Resolver extends Base {
  constructor(cb) {
    super(null, null, cb)

    this.__resolve = null
    this.__subscribe = null
    this.__arguments = {}
  }

  __setHandler = (kind, handler, ctx = null) => {
    const ref = `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`

    invariant(
      isFunction(this[`__${kind}`]),
      "%s handler already exists. " +
      "Add this resolver to current object type " +
      "before describe the new one.", ref
    )

    invariant(
      !isFunction(handler), TypeError, "%s handler should be a function.", ref
    )

    this[`__${kind}`] = ctx ? handler.bind(ctx) : handler

    return this
  }

  /**
   * Define resolver handler
   *
   * @param {function} handler
   *
   * @return {Resolver}
   */
  resolve = (...args) => this.__setHandler(kinds.RESOLVE, ...args)

  subscribe = (...args) => this.__setHandler(kinds.SUBSCRIBE, ...args)

  /**
   * Define arguments for resolver handler
   *
   * @param {string} name – argument name
   * @param {object} type – argument *input* type
   * @param {boolean} required
   *
   * @return {Resolver}
   */
  arg = options => {
    invariant(
      !isPlainObject(options), TypeError,
      "Argument configuration should be a plain object. Received %s",
      typeOf(options)
    )

    const {name, required, description} = options

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

    const defaultValue = options.default || options.defaultValue

    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this.__arguments[name] = omitNullish({type, description, defaultValue})

    return this
  }

  /**
   * Add resolver object
   */
  end() {
    return super.end(omitNullish({
      resolve: this.__resolve,
      subscribe: this.__subscribe,
      args: this.__arguments
    }))
  }
}

export {kinds, Resolver}
export default Resolver
