const basicTypes = [
  "null",
  "number",
  "object",
  "array",
  "string",
  "function",
  "undefined",
  "boolean"
]

/**
 * Get a string with type name of the given value
 *
 * @param {any} value
 *
 * @return {string}
 *
 * @api private
 */
function getType(value) {
  const type = Object.prototype.toString.call(value).slice(8, -1)

  if (basicTypes.includes(type.toLowerCase())) {
    return type.toLowerCase()
  }

  return type
}

export default getType
