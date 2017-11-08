import test from "ava"

import {
  GraphQLInputObjectType as TInput,
  GraphQLString as TString
} from "graphql"

import {Input, toRequired} from "../../../parasprite"

test("Should just create GraphQLInputObjectType after .end() call", t => {
  t.plan(1)

  const TNoopInput = Input("NoopInput").end()

  t.true(TNoopInput instanceof TInput)
})

test("Should create input type with the given name and description", t => {
  t.plan(2)

  const name = "NoopInput"
  const description = "Some random noop type"

  const TNoopInput = Input(name, description).end()

  t.is(TNoopInput.name, name)
  t.is(TNoopInput.description, description)
})

test("Should take name and description from given object", t => {
  t.plan(2)

  const name = "NoopInput"
  const description = "Some random noop type"

  const TNoopInput = Input({name, description}).end()

  t.is(TNoopInput.name, name)
  t.is(TNoopInput.description, description)
})

test("Should create input type with the given field", t => {
  t.plan(1)

  const expected = {
    login: {
      type: toRequired(TString),
      name: "login"
    },
    email: {
      type: toRequired(TString),
      name: "email"
    },
    password: {
      type: toRequired(TString),
      name: "password"
    }
  }

  const TUserInput = Input("UserInput")
    .field({
      name: "login",
      type: TString,
      required: true
    })
    .field({
      name: "email",
      type: TString,
      required: true
    })
    .field({
      name: "password",
      type: TString,
      required: true
    })
  .end()

  const actual = TUserInput.getFields()

  t.deepEqual(actual, expected)
})

test(
  "Should throw a TypeError when given field options is not a plain object",
  t => {
    t.plan(3)

    // An old syntax is no more supported
    const trap = () => Input("Noop").field("noop", TString, "Noop field")

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message, "Expected an object of the field options. Received string"
    )
  }
)

test("Should throw an error when no field name given", t => {
  t.plan(1)

  const trap = () => Input("Noop").field({})

  t.throws(trap, "Field name is required, but not given.")
})

test(
  "Should throw a TypeError when the given field name is not a string", t => {
    t.plan(3)

    const trap = () => Input("Noop").field({name: 0b101, type: TString})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(err.message, "Field name should be a string. Received number")
  }
)

test("Should throw an error when no field type given", t => {
  t.plan(1)

  const trap = () => Input("Noop").field({name: "noop"})

  t.throws(
    trap,
    "Given options.type property should be one of supported GraphQL types."
  )
})

test(
  "Should throw a TypeError when given type is not one of valid GraphQL types",
  t => {
    t.plan(3)

    const trap = () => Input("Noop").field({name: "noop", type: String})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Given options.type property should be one of supported GraphQL types."
    )
  }
)

test(
  "Should throw a TypeError when given type in a tuple " +
  "is not one of valid GraphQL types",
  t => {
    t.plan(3)

    const trap = () => Input("Noop").field({name: "noop", type: [Number, true]})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Given options.type property should be one of supported GraphQL types."
    )
  }
)

