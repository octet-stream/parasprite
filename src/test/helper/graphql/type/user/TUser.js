import {GraphQLString as TString} from "graphql"

import {Type} from "../../../../../parasprite"

const TUSer = Type("User")
  .field({
    name: "login",
    type: TString,
    required: true
  })
.end()

export default TUSer
