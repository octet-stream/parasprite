import typeOf from "./typeOf"

const isString = value => typeOf(value) === "string"

export default isString
