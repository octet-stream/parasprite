import toListTypeIfNeeded from "lib/util/internal/toListTypeIfNeeded"

const isArray = Array.isArray

const toListType = type => toListTypeIfNeeded(isArray(type) ? type : [type])

export default toListType
