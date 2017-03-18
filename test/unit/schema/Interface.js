import test from "ava"

import {
  GraphQLInterfaceType as TInterface,
  GraphQLString as TString
} from "graphql"

import Interface from "schema/Interface"

test("Should be a function", t => {
  t.plan(1)

  t.true(typeof Interface === "function")
})

test("Should create an interface with a given params", t => {
  t.plan(2)

  const expectedFields = {
    name: {
      type: TString,
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
    .field("name", TString, "Represends a character name")
  .end()

  t.true(ICharacter instanceof TInterface)

  const actualFields = ICharacter.getFields()

  t.deepEqual(actualFields, expectedFields)
})
