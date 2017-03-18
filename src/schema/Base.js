import isFunction from "helper/util/isFunction"

/**
 * Builtin class, do not use it directly
 * This class just implement default methods for child classes
 *
 * @api private
 */
class Base {
  constructor(cb = null) {
    if (isFunction(cb)) {
      this._callback = cb
    }
  }

  end(data) {
    return this._callback ? this._callback(data) : this
  }

  inspect() {
    return `Parasprite${this.constructor.name}`
  }

  toString() {
    return this.inspect()
  }

  valueOf() {
    return this.inspect()
  }
}

export default Base
