import {GraphQLString as TString} from "graphql"

import {Type} from "../../../../../parasprite"

import TUser from "./TUser"

const TViewer = Type("Viewer", {extends: TUser})
  .field({
    name: "email",
    type: TString,
    required: true,
    description: "Personal user email address"
  })
.end()

export default TViewer
