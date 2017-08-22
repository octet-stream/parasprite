import {GraphQLInterfaceType} from "graphql"

/**
 * Check if given value is an isstance of GraphQLInterfaceType
 *
 * @param {any} val
 *
 * @return {boolean}
 *
 * @api public
 */
const isGraphQLInterfaceType = val => val instanceof GraphQLInterfaceType

export default isGraphQLInterfaceType
