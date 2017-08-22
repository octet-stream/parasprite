import isFunction from "helper/util/isFunction"

const isArray = Array.isArray

/**
 * Check all types in list using given predicate.
 *   Return "true" when all satisfies the predicate.
 *
 * @param {any[]} – Array to check
 * @param {function} predicate – Predicate function that will be invoked
 *   for each element of given list
 * @param {any} ctx
 *
 * @return {boolean}
 *
 * @api public
 */
function checkTypedList(list, predicate, ctx) {
  if (!isArray(list)) {
    throw new TypeError("A list argument should be an array.")
  }

  if (!isFunction(predicate)) {
    throw new TypeError("Predicate should be a function.")
  }

  for (const [key, val] of list.entries()) {
    if (!predicate.call(ctx, val, key, list)) {
      return false
    }
  }

  return true
}

export default checkTypedList
