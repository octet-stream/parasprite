import {
  GraphQLNonNull
} from "graphql"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"

import Base from "schema/Base"

@proxy({apply})
class Resolver extends Base {
  constructor(cb) {
    super(cb)

    this.__callee = null
    this.__arguments = {}
  }

  resolve(callee) {
    this.__callee = callee

    return this
  }

  arg(name, type, required = false) {
    this.__arguments[name] = {
      type: required ? GraphQLNonNull(type) : type
    }

    return this
  }

  end() {
    const resolver = {
      resolve: this.__callee,
      args: this.__arguments
    }

    return super.end(resolver)
  }
}

export default Resolver
