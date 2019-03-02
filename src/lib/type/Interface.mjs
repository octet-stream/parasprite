import {GraphQLInterfaceType, isType} from "graphql"

import invariant from "@octetstream/invariant"

import typeOf from "lib/util/internal/typeOf"
import proxy from "lib/util/internal/proxy"
import isString from "lib/util/internal/isString"
import isFunction from "lib/util/internal/isFunction"
import apply from "lib/util/internal/selfInvokingClass"
import omitNullish from "lib/util/internal/omitNullish"
import isPlainObject from "lib/util/internal/isPlainObject"
import toListIfNeeded from "lib/util/internal/toListTypeIfNeeded"
import toRequiredIfNeeded from "lib/util/internal/toRequiredTypeIfNeeded"

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
      "The name should be a string. Received %s", typeOf(name)
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
      "Expected an object of the field options. Received %s", typeOf(options)
    )

    const {name, description, required} = options

    invariant(!name, "Field name is required, but not given.")

    invariant(
      !isString(name), TypeError,
      "Field name should be a string. Received %s", typeOf(name)
    )

    let type = options.type

    invariant(
      !isType(isArray(type) ? type[0] : type), TypeError,
      "Given options.type property should be one of supported GraphQL types."
    )

    const deprecationReason = options.deprecationReason || options.deprecate

    type = toRequiredIfNeeded(toListIfNeeded(options.type), required)

    this.__fields[name] = omitNullish({type, description, deprecationReason})

    return this
  }

  end() {
    return new GraphQLInterfaceType(omitNullish({
      name: this.__name,
      description: this.__description,
      fields: this.__fields,
      resolveType: this.__resolveType
    }))
  }
}

export default Interface