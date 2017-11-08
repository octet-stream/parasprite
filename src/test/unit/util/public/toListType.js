import test from "ava"

import {GraphQLString as TString, GraphQLList as TList} from "graphql"

import {toListType} from "../../../../parasprite"

test("Should create typed list from scalar value", t => {
  t.plan(1)

  const list = toListType(TString)

  t.true(list instanceof TList)
})

test("Should create typed list from an array", t => {
  t.plan(1)

  const list = toListType([TString])

  t.true(list instanceof TList)
})
