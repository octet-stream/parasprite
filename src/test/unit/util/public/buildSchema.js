import test from "ava"

import {GraphQLSchema, GraphQLObjectType as TObject} from "graphql"

import {buildSchema} from "../../../../parasprite"

test("Should return a GraphQLSchema instance", t => {
  t.plan(1)

  const schema = buildSchema("../../../helper/graphql/schema")

  t.true(schema instanceof GraphQLSchema)
})

test(
  "Should always have Query field which is instanceof GraphQLObjectType", t => {
    t.plan(1)

    const schema = buildSchema("../../../helper/graphql/schema")

    t.true(schema.getQueryType() instanceof TObject)
  }
)
