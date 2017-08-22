import isFunction from "helper/util/isFunction"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "lib/Base"

/**
 * Implements resolver field on GraphQLObjectType
 *
 * @api private
 */
@proxy({apply})
class Resolver extends Base {
  constructor(cb) {
    super(null, null, cb)

    this.__handler = null
    this.__arguments = {}
  }

  /**
   * Define resolver handler
   *
   * @param {function} handler
   *
   * @return {Resolver}
   */
  resolve(handler) {
    if (isFunction(this.__handler)) {
      throw new Error(
        "Resolve handler already exists. " +
        "Add this resolver to current object type " +
        "before describe the new one."
      )
    }

    if (!isFunction(handler)) {
      throw new TypeError("Resolve handler should be a function.")
    }

    this.__handler = handler

    return this
  }

  /**
   * Define arguments for resolver handler
   *
   * @param {string} name – argument name
   * @param {object} type – argument *input* type
   * @param {boolean} required
   *
   * @return {Resolver}
   */
  arg(name, type, required, defaultValue) {
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
    return super.end({
      resolve: this.__handler,
      args: this.__arguments
    })
  }
}

export default Resolver
