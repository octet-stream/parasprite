import invariant from "@octetstream/invariant"

import isPlainObject from "./isPlainObject"

const keys = Object.keys

/**
 * Allows to go through given object
 *
 * @param {object} object
 * @param {boolean} [entries = false]
 *
 * @yield {any | [string, any]} – the object value or entry tuple
 *
 * @generator
 *
 * @api private
 */
function* objectIterator(object, entries = false) {
  if (!object) {
    return
  }

  invariant(
    !isPlainObject(object), TypeError,
    "Iterable value should be a plain object."
  )

  for (const key of keys(object)) {
    const value = object[key]

    yield entries ? [key, value] : value
  }
}

const entries = object => objectIterator(object, true)

objectIterator.entries = entries

export default objectIterator
