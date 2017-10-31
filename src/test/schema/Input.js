import test from "ava"

import {GraphQLInputObjectType, GraphQLString, GraphQLNonNull} from "graphql"
import isFunction from "helper/util/isFunction"

import Base from "lib/Base"
import Input from "lib/Input"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(Input))
})

test("Should be a class that extends Base", t => {
  t.plan(1)

  t.true(Input() instanceof Base)
})

test(
  "Should be return an instance of GraphQLInputObjectType on \"end\"",
  t => {
    t.plan(1)

    const TSomeInputType = Input("TSomeInputType").end()

    t.true(TSomeInputType instanceof GraphQLInputObjectType)
  }
)

test("Should be return a type with specified name and description", t => {
  t.plan(2)

  const TSomeInputType = Input(
    "TSomeInputType", "Some input type description"
  ).end()

  t.is(TSomeInputType.name, "TSomeInputType")
  t.is(TSomeInputType.description, "Some input type description")
})

test("Should create a field with given params", t => {
  const expectedFileds = {
    someField: {
      name: "someField",
      type: GraphQLString,
      description: "Some description",
      defaultValue: undefined,
      deprecationReason: undefined
    }
  }

  const TSomeInputType = Input("TSomeInputType")
      .field({
        name: "someField",
        description: "Some description",
        type: GraphQLString
      })
    .end()

  const fields = TSomeInputType.getFields()

  t.deepEqual(fields, expectedFileds)
})

test("Should mark type as non-null when \"required\" parameter is true", t => {
  t.plan(1)

  const TSomeInputType = Input("TSomeInputType", "Some type description")
      .field({
        name: "someField",
        description: "Some description",
        type: [GraphQLString, false],
        required: true
      })
    .end()

  const {someField} = TSomeInputType.getFields()

  t.true(someField.type instanceof GraphQLNonNull)
})
