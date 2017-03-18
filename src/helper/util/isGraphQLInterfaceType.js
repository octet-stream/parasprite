import {GraphQLInterfaceType} from "graphql"

/**
 * Check if given value is an isstance of GraphQLInterfaceType
 */
const isGraphQLInterfaceType = val => val instanceof GraphQLInterfaceType

export default isGraphQLInterfaceType
