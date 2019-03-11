import getType from "lib/util/internal/getType"

const getPrototype = Object.getPrototypeOf
const objectCtorString = Object.toString()

/**
 * @private
 */
function isPlainObject(val) {
  if (getType(val) !== "object") {
    return false
  }

  const proto = getPrototype(val)

  if (proto == null) {
    return true
  }

  return proto.constructor && proto.constructor.toString() === objectCtorString
}

module.exports = isPlainObject
