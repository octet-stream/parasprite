import {GraphQLEnumType} from "graphql"

import invariant from "@octetstream/invariant"

import isPlainObject from "lib/util/internal/isPlainObject"
import omitNullish from "lib/util/internal/omitNullish"
import apply from "lib/util/internal/selfInvokingClass"
import deprecate from "lib/util/internal/deprecate"
import isString from "lib/util/internal/isString"
import getType from "lib/util/internal/getType"
import proxy from "lib/util/internal/proxy"

import Base from "./Base"

@proxy({apply})
class Enum extends Base {
  constructor(name, description) {
    invariant(!name, "Enum type requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name of Enum type should be a string. Received %s", getType(name)
    )

    super(name, description)

    this.__values = {}
  }

  field = (name, value, description, deprecationReason) => {
    if (isPlainObject(name)) {
      [name, value, description, deprecationReason] = [
        name.name, name.value, name.description, name.deprecationReason
      ]
    }

    this.__values[name] = {value, description, deprecationReason}

    return this
  }

  @deprecate("Enum#value() is deprecated. Use Enum#field() instead.")
  value = (...args) => this.field(...args)

  end() {
    return new GraphQLEnumType(omitNullish({
      name: this._name,
      description: this._description,
      values: this.__values
    }))
  }
}

export default Enum
