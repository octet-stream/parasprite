import test from "ava"

import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
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

test("Should return an instance of GraphQLSchema", t => {
  t.plan(1)

  const greeter = (_, {name}) => `Hello, ${name}!`

  const schema = Schema()
      .query("SomeQuery")
        .field("Foo", GraphQLString)
          .resolve(greeter)
            .arg("name", GraphQLString)
          .end()
        .end()
      .end()

  t.true(schema instanceof GraphQLSchema)
})
