import TypesMatcher from "lib/util/internal/TypesMatcher"

/**
 * @return {TypesMatcher}
 *
 * @api public
 */
const matchTypes = (matchers = undefined) => new TypesMatcher(matchers)

export default matchTypes
