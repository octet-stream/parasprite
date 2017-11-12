import invariant from "@octetstream/invariant"

import proxy from "../util/internal/proxy"
import isFunction from "../util/internal/isFunction"
import omitNullish from "../util/internal/omitNullish"
import apply from "../util/internal/selfInvokingClass"
import isPlainObject from "../util/internal/isPlainObject"
import toListTypeIfNeeded from "../util/internal/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "../util/internal/toRequiredTypeIfNeeded"

import Base from "./Base"

/**
 * Implements resolver field on GraphQLObjectType
 *
 * @api private
 */
@proxy({apply})
class Resolver extends Base {
  static get kinds() {
    return {
      RESOLVE: "resolve",
      SUBSCRIBE: "subscribe"
    }
  }

  constructor(cb) {
    super(null, null, cb)

    this.__resolve = null
    this.__subscribe = null
    this.__arguments = {}
  }

  __setHandler = (kind, handler) => {
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

    this[`__${kind}`] = handler

    return this
  }

  /**
   * Define resolver handler
   *
   * @param {function} handler
   *
   * @return {Resolver}
   */
  resolve = handler => this.__setHandler(Resolver.kinds.RESOLVE, handler)

  subscribe = handler => this.__setHandler(Resolver.kinds.SUBSCRIBE, handler)

  /**
   * Define arguments for resolver handler
   *
   * @param {string} name – argument name
   * @param {object} type – argument *input* type
   * @param {boolean} required
   *
   * @return {Resolver}
   */
  arg = (name, type, required, defaultValue) => {
    if (isPlainObject(name)) {
      [name, type, required, defaultValue] = [
        name.name, name.type, name.required, name.defaultValue || name.default
      ]
    }

    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this.__arguments[name] = {
      type
    }

    if (defaultValue !== undefined) {
      this.__arguments[name].defaultValue = defaultValue
    }

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

export default Resolver
