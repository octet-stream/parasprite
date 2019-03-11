import test from "ava"

import {GraphQLEnumType as TEnum} from "graphql"

import Enum from "Enum"

test("Returns GraphQLEnumType instance with given fields", t => {
  t.plan(3)

  const TColors = Enum("Colors")
    .field("red", "#f00")
    .field("green", "#0f0")
    .field("blue", "#0ff")
  .end()

  t.true(TColors instanceof TEnum)

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

test(".field() takes arguments from given object", t => {
  t.plan(3)

  const TColors = Enum("Colors")
    .field({name: "red", value: "#f00"})
    .field({name: "green", value: "#0f0"})
    .field({name: "blue", value: "#0ff"})
  .end()

  t.true(TColors instanceof TEnum)

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
  t.plan(1)

  const trap = () => Enum()

  t.throws(trap, "Enum type requires a name.")
})

test("Should throw an error when name is not a string", t => {
  t.plan(3)

  const trap = () => Enum(2319)

  const err = t.throws(trap)

  t.true(err instanceof TypeError)

  t.is(err.message, "The name of Enum type should be a string. Received number")
})
