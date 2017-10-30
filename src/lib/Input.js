import {GraphQLInputObjectType} from "graphql"

import invariant from "@octetstream/invariant"
import isPlainObject from "lodash.isplainobject"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import getType from "helper/util/getType"
import toListIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "lib/Base"

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
   */
  field = options => {
    invariant(
      !isPlainObject(options), TypeError,
      "Expected an object of the field options. Received %s", getType(options)
    )

    const {name, description, required} = options

    const deprecationReason = options.deprecationReason || options.deprecate

    const defaultValue = options.defaultValue || options.default

    const type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

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
