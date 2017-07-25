import {isString} from "util"

import {GraphQLEnumType} from "graphql"

import Base from "./Base"

class Enum extends Base {
  constructor(name, description) {
    if (!name) {
      throw new TypeError("Enum type cannot be anonymous.")
    }

    if (!isString(name)) {
      throw new TypeError("Name should be a string.")
    }

    super(name, description)

    this.__values = {}
  }

  value(name, value, description, deprecationReason) {
    this.__values[name] = {
      value, description, deprecationReason
    }

    return this
  }

  end() {
    return new GraphQLEnumType({
      name: this._name,
      description: this._description,
      values: this.__values
    })
  }
}

export default Enum
