import toListTypeIfNeeded from "./toListTypeIfNeeded"

const isArray = Array.isArray

const toListType = val => toListTypeIfNeeded(
  isArray(val) ? val : [val]
)

export default toListType
