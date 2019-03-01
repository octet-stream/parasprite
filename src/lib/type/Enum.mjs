import {GraphQLEnumType} from "graphql"
import invariant from "@octetstream/invariant"

import omitNullish from "../util/internal/omitNullish"
import apply from "../util/internal/selfInvokingClass"
import isString from "../util/internal/isString"
import typeOf from "../util/internal/typeOf"
import proxy from "../util/internal/proxy"

import Base from "./Base"

@proxy({apply})
class Enum extends Base {
  constructor(name, description) {
    invariant(!name, "Enum type requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name of Enum type should be a string. Received %s", typeOf(name)
    )

    super(name, description)

    this.__values = {}
  }

  value = (name, value, description, deprecationReason) => {
    this.__values[name] = {value, description, deprecationReason}

    return this
  }

  end() {
    return new GraphQLEnumType(omitNullish({
      name: this._name,
      description: this._description,
      values: this.__values
    }))
  }
}

export default Enum
