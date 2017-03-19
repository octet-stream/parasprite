import test from "ava"

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} from "graphql"
import isFunction from "helper/util/isFunction"

import Base from "schema/Base"
import Interface from "Interface"
import Type from "Type"

test("Should be a class that extends Base", t => {
  t.plan(2)

  t.true(isFunction(Type))

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
      .field("someField", GraphQLString, "Some description", false)
    .end()

  const fields = TSomeType.getFields()

  t.deepEqual(fields, expectedFileds)
})

test("Should mark type as non-null when \"required\" parameter is true", t => {
  t.plan(1)

  const TSomeType = Type("TSomeType", "Some type description")
      .field("someField", GraphQLString, true)
    .end()

  const {someField} = TSomeType.getFields()

  t.true(someField.type instanceof GraphQLNonNull)
})

test("Should also create a field from given object", t => {
  t.plan(2)

  const expectedFileds = {
    name: {
      name: "name",
      description: "Represends a character name",
      type: GraphQLString,
      isDeprecated: false,
      args: []
    }
  }

  const TCharacter = Type("TCharacter")
    .field({
      name: "name",
      description: "Represends a character name",
      type: GraphQLString
    })
    .end()

  t.true(TCharacter instanceof GraphQLObjectType)

  const actualFields = TCharacter.getFields()

  t.deepEqual(expectedFileds, actualFields)
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
      args: [{
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

test(
  "Should throw an error when field config passed withot \"name\" property",
  t => {
    t.plan(1)

    const trap = () => Type("TSomeType").field({
      // Doesn't have "name" property :)
      description: "Represends a character name",
      type: GraphQLString
    })

    t.throws(trap, "Field config should have \"name\" property.")
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

  const asList = () => Type("TFoo", "Some description", [42])
  t.throws(
    asList,
    "Interface should be an instance of " +
    "GraphQLInterfaceType or a list of them."
  )
})

// test("Should create a type with a given interface", t => {
//   const IFoo = Interface("IFoo")
//     .field("foo", GraphQLString)
//   .end()

//   const TFoo = Type("TFoo", "Some description", IFoo)
//     .field("foo", GraphQLString)
//   .end()

//   // console.log(TFoo.getInterfaces())
// })
