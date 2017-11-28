import {GraphQLObjectType} from "graphql"

const isObjectType = value => value instanceof GraphQLObjectType

export default isObjectType
