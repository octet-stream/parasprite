import test from "ava"

import {GraphQLNonNull, GraphQLString} from "graphql"
import isFunction from "helper/util/isFunction"

import toRequired from "helper/util/toRequired"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(toRequired))
})

test("Should return GraphQLNonNull type", t => {
  t.plan(1)

  t.true(
    toRequired(GraphQLString) instanceof GraphQLNonNull
  )
})
