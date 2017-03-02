import isFunction from "lodash.isfunction"

// Builtin class, do not use it directly
class Base {
  constructor(cb = null) {
    if (isFunction(cb)) {
      this._callback = cb
    }
  }

  end(data) {
    return this._callback ? this._callback(data) : this
  }
}

export default Base
