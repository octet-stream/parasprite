import {GraphQLInterfaceType, isType} from "graphql"

import invariant from "@octetstream/invariant"

import getType from "lib/util/internal/getType"
import proxy from "lib/util/internal/proxy"
import isString from "lib/util/internal/isString"
import apply from "lib/util/internal/selfInvokingClass"
import omitNullish from "lib/util/internal/omitNullish"
import isPlainObject from "lib/util/internal/isPlainObject"
import isTypesMatcher from "lib/util/internal/isTypesMatcher"
import toListIfNeeded from "lib/util/internal/toListTypeIfNeeded"
import toRequiredIfNeeded from "lib/util/internal/toRequiredTypeIfNeeded"

import TypesMatcher from "lib/util/internal/TypesMatcher"
import Base from "lib/type/Base"

const isArray = Array.isArray

@proxy({apply})
class Interface extends Base {
  /**
   * Create custim GraphQLInterfaceType using Parasprite chainable API
   *
   * @param {string} name
   * @param {string} description
   * @param {function} resolveType
   */
  constructor(name, description, resolveType) {
    if (isPlainObject(name)) {
      [name, description, resolveType] = [
        name.name, name.description, name.resolveType
      ]
    } else if (!isString(description)) {
      [resolveType, description] = [description, undefined]
    }

    invariant(!name, "The Interface constructor requires a name.")

    invariant(
      !isString(name), TypeError,
      "The name should be a string. Received %s", getType(name)
    )

    super(name, description)

    this.__fields = {}

    if (isTypesMatcher(resolveType)) {
      this.__matcher = resolveType
    } else {
      this.__matcher = new TypesMatcher(
        isArray(resolveType) ? Array.from(resolveType) : [resolveType]
      )
    }
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

    this.__fields[name] = omitNullish({type, description, deprecationReason})

    return this
  }

  end() {
    return new GraphQLInterfaceType(omitNullish({
      name: this._name,
      description: this._description,
      fields: this.__fields,
      resolveType: this.__matcher.exec
    }))
  }
}

export default Interface
