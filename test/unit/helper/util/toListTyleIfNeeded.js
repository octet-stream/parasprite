import test from "ava"

import {
  GraphQLString, GraphQLList, GraphQLScalarType, GraphQLNonNull
} from "graphql"
import isFunction from "helper/util/isFunction"

import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(toListTypeIfNeeded))
})

test("Should return given type without any changes", t => {
  t.plan(3)

  const res = toListTypeIfNeeded(GraphQLString)

  t.true(res instanceof GraphQLScalarType)
  t.is(res.name, GraphQLString.name)
  t.deepEqual(res, GraphQLString)
})

test("Should return GraphQLList type when array with type given", t => {
  t.plan(1)

  t.true(toListTypeIfNeeded([GraphQLString]) instanceof GraphQLList)
})

test(
  "Should mark type in list as non-null if the second element of array is true",
  t => {
    t.plan(4)

    const TListOfString = toListTypeIfNeeded([GraphQLString, true])

    t.true(TListOfString.ofType instanceof GraphQLNonNull)
    t.true(TListOfString.ofType.ofType instanceof GraphQLScalarType)
    t.is(TListOfString.ofType.ofType.name, GraphQLString.name)
    t.deepEqual(TListOfString.ofType.ofType, GraphQLString)
  }
)
