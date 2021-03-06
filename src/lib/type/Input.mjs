import {GraphQLInputObjectType, isType} from "graphql"

import invariant from "@octetstream/invariant"

import proxy from "lib/util/internal/proxy"
import getType from "lib/util/internal/getType"
import isString from "lib/util/internal/isString"
import omitNullish from "lib/util/internal/omitNullish"
import apply from "lib/util/internal/selfInvokingClass"
import isPlainObject from "lib/util/internal/isPlainObject"
import toListIfNeeded from "lib/util/internal/toListTypeIfNeeded"
import toRequiredIfNeeded from "lib/util/internal/toRequiredTypeIfNeeded"

import Base from "./Base"

const isArray = Array.isArray

@proxy({apply})
class Input extends Base {
  /**
   * Describe GraphQL input type
   *
   * @param {string} name
   * @param {string} description
   */
  constructor(name, description) {
    if (isPlainObject(name)) {
      [name, description] = [name.name, name.description]
    }

    super(name, description)

    /**
     * @protected
     */
    this._fields = {}
  }

  /**
   * @param {object} options
   *
   * @return {Input}
   */
  field = options => {
    invariant(
      !isPlainObject(options), TypeError,
      "Expected an object of the field options. Received %s", getType(options)
    )

    const {name, description, required} = options

    invariant(!name, "Field name is required, but not given.")

    invariant(
      !isString(name), TypeError,
      "Field name should be a string. Received %s", getType(name)
    )

    let type = options.type

    invariant(
      !isType(isArray(type) ? type[0] : type), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    const defaultValue = options.defaultValue || options.default

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this._fields[name] = omitNullish({
      type, description, defaultValue, deprecationReason
    })

    return this
  }

  end() {
    return new GraphQLInputObjectType(omitNullish({
      name: this._name,
      description: this._description,
      fields: this._fields
    }))
  }
}

export default Input
