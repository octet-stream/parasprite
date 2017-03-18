import test from "ava"

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from "graphql"
import isFunction from "helper/util/isFunction"

import Base from "schema/Base"

import Schema from "parasprite"
import Type from "Type"
import Input from "Input"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(Schema))
})

test("Should be an instance of Base class", t => {
  t.plan(1)

  t.true(Schema() instanceof Base)
})

test("Should return an instance of GraphQLSchema with valid fields", t => {
  t.plan(5)

  const TInFile = Input("TInFile")
    .field("originalName", GraphQLString, true)
    .field("path", GraphQLString, true)
    .field("mime", GraphQLString, true)
    .field("enc", GraphQLString, true)
    .end()

  const schema = Schema()
    .query("SomeQuery")
      .resolve("greeter", GraphQLString, () => {})
        .arg("name", GraphQLString)
      .end()
    .end()
    .mutation("SomeMutation")
      .resolve("uploadImage", GraphQLString, () => {})
        .arg("image", TInFile)
      .end()
    .end()
  .end()

  t.true(schema instanceof GraphQLSchema)

  const query = schema.getQueryType()
  const mutation = schema.getMutationType()

  // Check Query type
  t.is(query.name, "SomeQuery", "Should have a valid query type.")
  t.true(
    query instanceof GraphQLObjectType,
    "Query should be an instance of GraphQLObjectType"
  )

  // Check Mutation type
  t.is(mutation.name, "SomeMutation", "Should have a valid mutation type.")
  t.true(
    mutation instanceof GraphQLObjectType,
    "Query should be an instance of GraphQLObjectType"
  )
})

test("Should also make schema with a predifined query", t => {
  t.plan(3)

  const Query = Type("Query")
    .resolve("greeter", GraphQLString, () => {})
      .arg("name", GraphQLString)
    .end()
  .end()

  const schema = Schema().query(Query).end()

  t.true(schema instanceof GraphQLSchema)

  const query = schema.getQueryType()

  t.true(query instanceof GraphQLObjectType)
  t.is(query.name, "Query", "Should have a valid name")
})
