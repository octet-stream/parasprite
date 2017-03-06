import test from "ava"

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from "graphql"
import isFunction from "lodash.isfunction"

import Base from "schema/Base"
import Schema from "parasprite"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(Schema))
})

test("Should be an instance of Base class", t => {
  t.plan(1)

  t.true(Schema() instanceof Base)
})

test("Should return an instance of GraphQLSchema with valid fields", t => {
  t.plan(3)

  const greeter = (_, {name}) => `Hello, ${name}!`

  const schema = Schema()
    .query("SomeQuery")
      .resolve("greeter", GraphQLString, greeter)
        .arg("name", GraphQLString)
        .end()
      .end()
    .end()

  t.true(schema instanceof GraphQLSchema)

  const query = schema.getQueryType()

  t.is(query.name, "SomeQuery", "Should have a valid query type.")
  t.true(
    query instanceof GraphQLObjectType,
    "Query should be an instance of GraphQLObjectType"
  )
})
