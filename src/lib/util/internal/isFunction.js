import typeOf from "./typeOf"

/**
 * Check if given value is a function
 *
 * @param {any} value
 *
 * @return {boolean}
 */
const isFunction = value => typeOf(value) === "function"

export default isFunction
