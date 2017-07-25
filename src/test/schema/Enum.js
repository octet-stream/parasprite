import test from "ava"

import {GraphQLEnumType} from "graphql"

import Enum from "lib/Enum"

test("Should create a GraphQLEnumType type", t => {
  t.plan(3)

  const TColors = Enum("Colors")
    .value("red", "#f00")
    .value("green", "#0f0")
    .value("blue", "#0ff")
  .end()

  t.true(TColors instanceof GraphQLEnumType)

  t.is(TColors.name, "Colors")

  const expectedValue = [
    {
      name: "red",
      description: undefined,
      isDeprecated: false,
      deprecationReason: undefined,
      astNode: undefined,
      value: "#f00"
    },
    {
      name: "green",
      description: undefined,
      isDeprecated: false,
      deprecationReason: undefined,
      astNode: undefined,
      value: "#0f0"
    },
    {
      name: "blue",
      description: undefined,
      isDeprecated: false,
      deprecationReason: undefined,
      astNode: undefined,
      value: "#0ff"
    }
  ]

  const actualValues = TColors.getValues()

  t.deepEqual(actualValues, expectedValue)
})

test("Should throw an error on class invocation without name", t => {
  t.plan(3)

  const trap = () => Enum()

  const err = t.throws(trap)

  t.true(err instanceof TypeError)

  t.is(err.message, "Enum type cannot be anonymous.")
})

test("Should throw an error when name is not a string", t => {
  t.plan(3)

  const trap = () => Enum(2319)

  const err = t.throws(trap)

  t.true(err instanceof TypeError)

  t.is(err.message, "Name should be a string.")
})
