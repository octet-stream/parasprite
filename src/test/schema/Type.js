import test from "ava"

import {
  GraphQLObjectType,
  GraphQLInterfaceType,
  GraphQLString,
  GraphQLNonNull
} from "graphql"

import isFunction from "helper/util/isFunction"

import Base from "lib/Base"
import Interface from "lib/Interface"
import Type from "lib/Type"

test("Should be a class that extends Base", t => {
  t.plan(1)

  const TSomeType = Type("TSomeType")

  t.true(TSomeType instanceof Base)
})

test(
  "Should be return an instance of GraphQLObjectType on \"end\" invocation",
  t => {
    t.plan(1)

    const TSomeType = Type("TSomeType").end()

    t.true(TSomeType instanceof GraphQLObjectType)
  }
)

test("Should create Type with name and isTypeOf function", t => {
  t.plan(2)

  const TFoo = Type("TFoo", () => {}).end()

  t.true(TFoo instanceof GraphQLObjectType)
  t.true(isFunction(TFoo.isTypeOf))
})

test("Should be return a type with specified name and description", t => {
  t.plan(2)

  const TSomeType = Type("TSomeType", "Some type description").end()

  t.is(TSomeType.name, "TSomeType")
  t.is(TSomeType.description, "Some type description")
})

test("Should create a field with given params", t => {
  const expectedFileds = {
    someField: {
      name: "someField",
      type: GraphQLString,
      description: "Some description",
      deprecationReason: undefined,
      isDeprecated: false,
      args: []
    }
  }

  const TSomeType = Type("TMyObjectType")
    .field({
      name: "someField",
      type: GraphQLString,
      description: "Some description"
    })
  .end()

  const fields = TSomeType.getFields()

  t.deepEqual(fields, expectedFileds)
})

test("Should mark type as non-null when \"required\" parameter is true", t => {
  t.plan(1)

  const TSomeType = Type("TSomeType", "Some type description")
    .field({
      name: "someField",
      type: GraphQLString,
      required: true
    })
  .end()

  const {someField} = TSomeType.getFields()

  t.true(someField.type instanceof GraphQLNonNull)
})

test("Should create resolver from config", t => {
  t.plan(2)

  const greeter = (_, {name}) => `Hello, ${name}!`

  const THello = Type("THello")
    .resolve({
      name: "greet",
      type: GraphQLString,
      handler: greeter
    })
      .arg("name", GraphQLString)
    .end()
  .end()

  t.true(THello instanceof GraphQLObjectType)

  const expectedFileds = {
    greet: {
      name: "greet",
      type: GraphQLString,
      resolve: greeter,
      isDeprecated: false,
      deprecationReason: undefined,
      description: undefined,
      args: [{
        astNode: undefined,
        name: "name",
        description: null,
        type: GraphQLString,
        defaultValue: undefined
      }]
    }
  }

  const actualFields = THello.getFields()

  t.deepEqual(expectedFileds, actualFields)
})

test("Should create a type with a given interface", t => {
  t.plan(3)

  class Cat {
    constructor(name, meows) {
      this.name = name
      this.meows = meows
    }
  }

  const IAnimal = Interface("IAnimal")
    .field({
      name: "name",
      type: GraphQLString
    })
  .end()

  t.true(IAnimal instanceof GraphQLInterfaceType)

  const isTypeOf = val => val instanceof Cat

  const TCat = Type("TCat", "Represends a Cat type", IAnimal, isTypeOf)
    .field({
      name: "name",
      type: GraphQLString
    })
    .field({
      name: "meows",
      type: GraphQLString
    })
  .end()

  t.true(TCat instanceof GraphQLObjectType)

  const expectedInterfaces = [IAnimal]

  const actualInterfaces = TCat.getInterfaces()

  t.deepEqual(expectedInterfaces, actualInterfaces)
})

test(
  "Should throw an error when field config passed withot \"name\" property",
  t => {
    t.plan(1)

    const trap = () => Type("TSomeType").field({
      // Doesn't have "name" property :)
      description: "Represends a character name",
      type: GraphQLString
    })

    t.throws(trap, "Field name is required, but not given.")
  }
)

test("Should throw an error when interfaces passed in wrong type", t => {
  t.plan(2)

  const asJustAWrongType = () => Type("TFoo", "Some description", 451)
  t.throws(
    asJustAWrongType,
    "Interface should be an instance of " +
    "GraphQLInterfaceType or a list of them."
  )

  const asList = () => Type("TFoo", [42])
  t.throws(
    asList,
    "Interface should be an instance of " +
    "GraphQLInterfaceType or a list of them."
  )
})

test("Should throw a TypeError when Type class invoked without name", t => {
  t.plan(1)

  const trap = () => Type()

  t.throws(trap, "Type cannot be anonymous.")
})

test("Should throw a TypeError when passed Type name is not a string", t => {
  t.plan(1)

  const trap = () => Type(0b101) // High five!

  t.throws(trap, "Name should be a string.")
})
