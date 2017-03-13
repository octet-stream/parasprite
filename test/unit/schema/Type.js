import test from "ava"

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from "graphql"
import isFunction from "helper/util/isFunction"

import Base from "schema/Base"
import Type from "schema/Type"

test("Should be a class that extends Base", t => {
  t.plan(2)

  t.true(isFunction(Type))

  const TSomeType = Type("TSomeType")

  t.true(TSomeType instanceof Base)
})

test(
  "Should be return an instance of GraphQLObjectType on \"end\" invocation",
  t => {
    t.plan(1)

    const TSomeType = Type("TSomeType").end()

    t.true(TSomeType instanceof GraphQLObjectType)
  }
)

test("Should be return a type with specified name and description", t => {
  t.plan(2)

  const TSomeType = Type("TSomeType", "Some type description").end()

  t.is(TSomeType.name, "TSomeType")
  t.is(TSomeType.description, "Some type description")
})

test("Should create a field with given params", t => {
  const expectedFileds = {
    someField: {
      name: "someField",
      type: GraphQLString,
      description: "Some description",
      deprecationReason: undefined,
      isDeprecated: false,
      args: []
    }
  }

  const TSomeType = Type("TMyObjectType")
      .field("someField", GraphQLString, "Some description")
    .end()

  const fields = TSomeType.getFields()

  t.deepEqual(fields, expectedFileds)
})

test("Should mark type as non-null when \"required\" parameter is true", t => {
  t.plan(1)

  const TSomeType = Type("TSomeType", "Some type description")
      .field("someField", GraphQLString, true)
    .end()

  const {someField} = TSomeType.getFields()

  t.true(someField.type instanceof GraphQLNonNull)
})
