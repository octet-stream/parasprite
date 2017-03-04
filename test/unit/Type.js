import test from "ava"

import {
  GraphQLObjectType,
  GraphQLString
} from "graphql"
import isFunction from "lodash.isfunction"

import Base from "schema/Base"
import Type from "schema/Type"

test("Should be a class that extends Base", t => {
  t.plan(2)

  t.true(isFunction(Type))

  const someType = Type("TSomeType")

  t.true(someType instanceof Base)
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
