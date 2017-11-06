import {GraphQLNonNull} from "graphql"

/**
 * Mark iven GraphQL type as non-null if the second argument set to true
 *   unless return this one withot any changes.
 *
 * @param {any} type – any GraphQL type that can be marked as non-null
 * @param {boolean} required
 *
 * @return {any} – given GraphQL type
 *
 * @api private
 */
const toRequiredTypeIfNeeded = (type, required = false) => (
  required ? new GraphQLNonNull(type) : type
)

export default toRequiredTypeIfNeeded
