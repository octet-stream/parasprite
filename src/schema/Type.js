import {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull
} from "graphql"

// import isEmpty from "lodash.isempty"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "schema/Base"

const isArray = Array.isArray

@proxy({apply})
class Type extends Base {
  constructor(name, description, cb) {
    super(cb)

    this._name = name
    this._description = description
    this._fields = {}
  }

  /**
   * Add a field to Type
   *
   * @param string name
   * @param object type
   * @param string description
   * @param boolean required – should field be non-null?
   * @param string deprecationReason – the message that will be displayed as
   *   field deprecation note.
   *
   * @return Type
   */
  field(name, type, description, required, deprecationReason) {
    if (typeof description === "boolean") {
      [required, description] = [description, null]
    }

    if (isArray(type)) {
      type = new GraphQLList(type[0])
    }

    // Mark type as non-null if "required" parameter is true
    if (required === true) {
      type = new GraphQLNonNull(type)
    }

    if (!this._callback) {
      this._fields[name] = {
        type, description, deprecationReason
      }

      return this
    }
  }

  // interface() {}

  /**
   * Make your type
   *
   * @return object
   */
  end() {
    const TObjectType = new GraphQLObjectType({
      name: this._name,
      description: this._description,
      fields: this._fields
    })

    return this._callback ? super.end(TObjectType) : TObjectType
  }
}

export default Type
