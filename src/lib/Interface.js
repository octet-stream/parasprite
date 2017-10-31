import {isString} from "util"

import {GraphQLInterfaceType, isType} from "graphql"

import invariant from "@octetstream/invariant"
import isPlainObject from "lodash.isplainobject"

import getType from "helper/util/getType"
import proxy from "helper/decorator/proxy"
import isFunction from "helper/util/isFunction"
import apply from "helper/proxy/selfInvokingClass"
import toListIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredIfNeeded from "helper/util/toRequiredTypeIfNeeded"

const isArray = Array.isArray

@proxy({apply})
class Interface {
  /**
   * Create custim GraphQLInterfaceType using Parasprite chainable API
   *
   * @param {string} name
   * @param {string} description
   * @param {function} resolveType
   */
  constructor(name, description, resolveType) {
    if (isFunction(description)) {
      [resolveType, description] = [description, undefined]
    }

    invariant(!name, "The Interface constructor requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name should be a string. Received %s", getType(name)
    )

    this.__name = name
    this.__description = description
    this.__fields = {}

    // Private
    this.__resolveType = resolveType
  }

  /**
   * Add a field to the Interface
   *
   * @param {string} name
   * @param {object} type
   * @param {string} description
   * @param {string} deprecationReason – the message that will be displayed as
   *   field deprecation note.
   * @param boolean required – should field be non-null?
   *
   * @return {Interface}
   *
   * @access public
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

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this.__fields[name] = {type, description, deprecationReason}

    return this
  }

  end() {
    return new GraphQLInterfaceType({
      name: this.__name,
      description: this.__description,
      fields: this.__fields,
      resolveType: this.__resolveType
    })
  }
}

export default Interface
