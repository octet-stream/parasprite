import toRequiredTypeIfNeeded from "../internal/toRequiredTypeIfNeeded"

/**
 * Public version of toRequiredTypeIfNeeded that just mark given type
 *   as non-null.
 *
 * @param {any} type – any GraphQLType
 * @param {any} – type, marked as non-null
 *
 * @api public
 */
const toRequired = type => toRequiredTypeIfNeeded(type, true)

export default toRequired
