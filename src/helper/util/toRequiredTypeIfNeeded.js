import {GraphQLNonNull} from "graphql"

const toRequiredTypeIfNeeded = (type, required) => (
  required === true ? new GraphQLNonNull(type) : type
)

export default toRequiredTypeIfNeeded
