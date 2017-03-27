import {GraphQLList} from "graphql"

import toRequired from "./toRequiredTypeIfNeeded"

const isArray = Array.isArray

/**
 * Convert GraphQL type to GraphQLListType if given value is an array.
 * Also, mark GraphQL type as non-null if the second element of given array
 *   is set to true.
 *
 * @param any
 *
 * @return any
 *
 * @api public
 */
const toListTypeIfNeeded = t => (
  isArray(t) ? new GraphQLList(t[1] ? toRequired(...t) : t[0]) : t
)

export default toListTypeIfNeeded
