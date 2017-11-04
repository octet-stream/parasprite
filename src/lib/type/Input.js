import {GraphQLInputObjectType, isType} from "graphql"

import invariant from "@octetstream/invariant"

import proxy from "../util/internal/proxy"
import typeOf from "../util/internal/typeOf"
import isString from "../util/internal/isString"
import apply from "../util/internal/selfInvokingClass"
import isPlainObject from "../util/internal/isPlainObject"
import toListIfNeeded from "../util/internal/toListTypeIfNeeded"
import toRequiredIfNeeded from "../util/internal/toRequiredTypeIfNeeded"

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
      "Expected an object of the field options. Received %s", typeOf(options)
    )

    const {name, description, required} = options

    invariant(
      !isString(name), TypeError,
      "Field name should be a string. Received %s", typeOf(name)
    )

    invariant(!name, "Field name is required, but not given.")

    let type = options.type

    invariant(
      !isType(isArray(type) ? type[0] : type), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    const defaultValue = options.defaultValue || options.default

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this._fields[name] = {type, description, defaultValue, deprecationReason}

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
