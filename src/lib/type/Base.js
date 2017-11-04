import isFunction from "../util/internal/isFunction"

/**
 * Builtin class, do not use it directly
 * This class just implement default methods for child classes
 *
 * @api private
 */
class Base {
  constructor(name, description, cb = null) {
    if (isFunction(cb)) {
      this._callback = cb
    }

    this._name = name
    this._description = description

    this.end = this.end.bind(this)
  }

  end(data) {
    return this._callback ? this._callback(data) : this
  }

  inspect() {
    return `Parasprite${this.constructor.name}`
  }

  toString() {
    return `Parasprite${this.constructor.name}`
  }

  valueOf() {
    return `Parasprite${this.constructor.name}`
  }
}

export default Base
