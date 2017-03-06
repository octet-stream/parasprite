import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "schema/Base"

@proxy({apply})
class Resolver extends Base {
  constructor(cb) {
    super(cb)

    this.__callee = null
    this.__arguments = {}
  }

  /**
   * Define resolver handler
   *
   * @param function callee
   *
   * @return Resolver
   */
  resolve(callee) {
    this.__callee = callee

    return this
  }

  /**
   * Define arguments for resolver handler
   *
   * @param string name – argument name
   * @param object type – argument *input* type
   * @param boolean required
   *
   * @return Resolver
   */
  arg(name, type, required) {
    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this.__arguments[name] = {
      type
    }

    return this
  }

  /**
   * Add resolver object
   */
  end() {
    return super.end({
      resolve: this.__callee,
      args: this.__arguments
    })
  }
}

export default Resolver
