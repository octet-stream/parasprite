import test from "ava"

import {GraphQLInterfaceType, GraphQLString as TString} from "graphql"

import {Interface, toListType, toRequired} from "parasprite"

test("Returns GraphQLInterfaceType after .end() call", t => {
  const interf = Interface("Interface", () => {}).end()

  t.true(interf instanceof GraphQLInterfaceType)
})

test("Returns an Interface with given parameters", t => {
  const interf = Interface("SomeInterface", "Some description", () => {}).end()

  t.is(interf.name, "SomeInterface")
  t.is(interf.description, "Some description")
})

test("Applies parameters from given object", t => {
  const interf = Interface({
    name: "SomeInterface",
    description: "Some description",
    resolveType() { }
  }).end()

  t.is(interf.name, "SomeInterface")
  t.is(interf.description, "Some description")
})

test("Applies given fields from .field()", t => {
  const interf = Interface("Interface", () => {})
    .field({
      name: "someField",
      type: TString
    })
  .end()

  t.deepEqual(interf.getFields(), {
    someField: {
      name: "someField",
      type: TString,
      isDeprecated: false,
      args: []
    }
  })
})

test(".field() allows to set types from array", t => {
  const interf = Interface("Interface", () => {})
    .field({
      name: "someField",
      type: [TString, true]
    })
  .end()

  t.deepEqual(interf.getFields(), {
    someField: {
      name: "someField",
      type: toListType(toRequired(TString)),
      isDeprecated: false,
      args: []
    }
  })
})
