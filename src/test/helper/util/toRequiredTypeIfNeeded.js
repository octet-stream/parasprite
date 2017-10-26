import test from "ava"

import {GraphQLNonNull, GraphQLString, GraphQLScalarType} from "graphql"
import isFunction from "helper/util/isFunction"

import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(toRequiredTypeIfNeeded))
})

test("Should return given type without any changes", t => {
  t.plan(3)

  const res = toRequiredTypeIfNeeded(GraphQLString)

  t.true(res instanceof GraphQLScalarType)
  t.is(res.name, GraphQLString.name)
  t.deepEqual(res, GraphQLString)
})

test("Should return GraphQLNonNull type when the second argument is true",
  t => {
    t.plan(1)

    t.true(
      toRequiredTypeIfNeeded(GraphQLString, true) instanceof GraphQLNonNull
    )
  })
