import {GraphQLList} from "graphql"

const isArray = Array.isArray

const toListTypeIfNeeded = type => (
  isArray(type) ? new GraphQLList(type[0]) : type
)

export default toListTypeIfNeeded
