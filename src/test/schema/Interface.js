import test from "ava"

import {GraphQLInterfaceType, GraphQLString} from "graphql"

import Interface from "lib/Interface"

test("Should be a function", t => {
  t.plan(1)

  t.is(typeof Interface, "function")
})

test("Should create an interface with a given params", t => {
  t.plan(2)

  const expectedFields = {
    name: {
      type: GraphQLString,
      description: "Represends a character name",
      deprecationReason: undefined,
      isDeprecated: false,
      name: "name",
      args: []
    }
  }

  const ICharacter = Interface(
    "ICharacter", "Represends a typical character interface"
  )
    .field({
      name: "name",
      description: "Represends a character name",
      type: GraphQLString
    })
  .end()

  t.true(ICharacter instanceof GraphQLInterfaceType)

  const actualFields = ICharacter.getFields()

  t.deepEqual(actualFields, expectedFields)
})

test(
  "Should also create an Interface without description, but with resolveType",
  t => {
    t.plan(2)

    const ISomeInterface = Interface("ISomeInterface", () => {}).end()

    t.true(ISomeInterface instanceof GraphQLInterfaceType)
    t.is(typeof ISomeInterface.resolveType, "function")
  }
)

test(
  "Should throw a TypeError when Interface class invoked without name",
  t => {
    t.plan(1)

    const trap = () => Interface()

    t.throws(trap, "The Interface constructor requires a name.")
  }
)

test(
  "Should throw a TypeError when given Interface name is not a string",
  t => {
    t.plan(3)

    const trap = () => Interface({})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(err.message, "The name should be a string. Received object")
  }
)
