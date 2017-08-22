import toRequiredTypeIfNeeded from "./toRequiredTypeIfNeeded"

/**
 * Public version of toRequiredTypeIfNeeded that just mark given type
 *   as non-null.
 *
 * @param {any} t – any GraphQLType
 * @param {any} – type, marked as non-null
 *
 * @api public
 */
const toRequired = t => toRequiredTypeIfNeeded(t, true)

export default toRequired
