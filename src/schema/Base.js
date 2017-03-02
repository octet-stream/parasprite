import isFunction from "lodash.isfunction"

// Builtin class, do not use it directly
class Base {
  constructor(cb = null) {
    if (isFunction(cb)) {
      this.__callback = cb
    }
  }

  end(data) {
    return isFunction(this.__callback) ? this.__callback(data) : this
  }
}

export default Base
