import test from "ava"

import {
  GraphQLString as TString,
  GraphQLScalarType as TScalar
} from "graphql"

import isListOf from "../../../lib/util/public/isListOf"

test("Should be a function", t => {
  t.plan(1)

  t.true(typeof isListOf === "function")
})

test("Should throw an error when passed list argument is not an array", t => {
  t.plan(1)

  const trap = () => isListOf(null)

  t.throws(trap, "A list argument should be an array.")
})

test(
  "Should throw a TypeError when predicate argument is not a function",
  t => {
    t.plan(1)

    const trap = () => isListOf([], null)

    t.throws(trap, "Predicate should be a function.")
  }
)

test(
  "Should return true when each element of given list is a valid type",
  t => {
    t.plan(1)

    const list = [TString, TString, TString]

    const predicate = val => val instanceof TScalar && val.name === "String"

    t.true(isListOf(list, predicate))
  }
)

test(
  "Should return false when one (or more than one) element in given list " +
  "have an unexpected type",
  t => {
    t.plan(1)

    const list = [
      TString,
      null, // This is the wrong type due to predicate condition
      TString
    ]

    const predicate = val => val instanceof TScalar && val.name === "String"

    t.false(isListOf(list, predicate))
  }
)
