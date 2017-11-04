import omitBy from "lodash.omitby"

const omitNullish = object => omitBy(object, value => value == null)

export default omitNullish
