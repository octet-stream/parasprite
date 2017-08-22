import {GraphQLNonNull} from "graphql"

/**
 * Mark iven GraphQL type as non-null if the second argument set to true
 *   unless return this one withot any changes.
 *
 * @param {any} t – any GraphQL type that can be marked as non-null
 * @param {boolean} required
 *
 * @return {any} – given GraphQL type
 *
 * @api private
 */
const toRequiredTypeIfNeeded = (t, required) => (
  required === true ? new GraphQLNonNull(t) : t
)

export default toRequiredTypeIfNeeded
