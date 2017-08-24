import {GraphQLInputObjectType} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "lib/Base"

@proxy({apply})
class Input extends Base {
  /**
   * Describe GraphQL input type
   *
   * @param {string} name
   * @param {string} description
   */
  constructor(name, description, cb) {
    super(name, description, cb)

    // protected members
    this._fields = {}
  }

  field = (name, type, description, required, defaultValue) => {
    // FIXME: Needs review
    if (typeof description === "boolean") {
      [required, description, defaultValue] = [
        description, undefined, required
      ]
    }

    // Convert given type to GraphQLList if it is an array
    //   Also, mark returned type as non-null if needed
    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this._fields[name] = {
      type, defaultValue, description
    }

    return this
  }

  end() {
    return new GraphQLInputObjectType({
      name: this._name,
      description: this._description,
      fields: this._fields
    })
  }
}

export default Input
