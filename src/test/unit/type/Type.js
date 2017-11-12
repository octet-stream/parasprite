import test from "ava"

import {
  GraphQLObjectType as TObject,
  GraphQLString as TString,
  GraphQLInt as TInt
} from "graphql"

import {Type, toRequired} from "../../../parasprite"

test("Should return a GraphQLObjectType after .end() call", t => {
  t.plan(1)

  const TNoop = Type("Noop").end()

  t.true(TNoop instanceof TObject)
})

test("Should create a type with the given name and description", t => {
  t.plan(2)

  const name = "Noop"
  const description = "Some random noop type"

  const TNoop = Type(name, description).end()

  t.is(TNoop.name, name)
  t.is(TNoop.description, description)
})

test("Should take name and description from given object", t => {
  t.plan(2)

  const name = "Noop"
  const description = "Some random noop type"

  const TNoop = Type({name, description}).end()

  t.is(TNoop.name, name)
  t.is(TNoop.description, description)
})

test("Should create an object type with the given field", t => {
  t.plan(2)

  const expected = {
    name: "login",
    type: toRequired(TString),
    isDeprecated: false,
    args: []
  }

  const TUser = Type("User")
    .field({
      name: "login",
      type: TString,
      required: true
    })
  .end()

  const fields = TUser.getFields()

  t.true("login" in fields)
  t.deepEqual(fields.login, expected)
})

test("Should extend one object type from the other", t => {
  t.plan(1)

  const expectedMinimal = {
    login: {
      name: "login",
      type: toRequired(TString),
      description: "Unique, human-readable name.",
      args: [],
      isDeprecated: false
    },
    email: {
      name: "email",
      type: toRequired(TString),
      description: "Personal email address",
      args: [],
      isDeprecated: false
    }
  }

  const expectedAge = {
    age: {
      name: "age",
      type: TInt,
      args: [],
      isDeprecated: false
    }
  }

  const TUserMinimal = Type("UserMinimal")
    .field({
      name: "login",
      type: TString,
      description: "Unique, human-readable name.",
      required: true
    })
    .field({
      name: "email",
      type: TString,
      description: "Personal email address",
      required: true
    })
  .end()

  const TUserWithAge = Type("UserWithAge", {extends: TUserMinimal})
    .field({
      name: "age",
      type: TInt
    })
  .end()

  t.deepEqual(TUserWithAge.getFields(), {
    ...expectedMinimal, ...expectedAge
  })
})

test("Should add a resolver from .resolve() method", t => {
  t.plan(4)

  const TUserContacts = Type("UserContacts")
    .field({
      name: "email",
      type: TString
    })
    .field({
      name: "website",
      type: TString
    })
  .end()

  const contacts = {email: "j.doe@example.com", website: "example.com"}

  const handler = () => ({...contacts})

  const expected = {
    name: "contacts",
    type: TUserContacts,
    resolve: handler,
    args: [],
    isDeprecated: false,
  }

  const TUser = Type("User")
    .resolve({
      name: "contacts",
      type: TUserContacts,
      noArgs: true,
      handler
    })
  .end()

  const fields = TUser.getFields()

  t.true("contacts" in fields)
  t.deepEqual(fields.contacts, expected)

  t.is(typeof fields.contacts.resolve, "function")
  t.deepEqual(fields.contacts.resolve(), contacts)
})

test("Should extend object type with the resolver field", t => {
  const TUserContacts = Type("UserContacts")
    .field({
      name: "email",
      type: TString
    })
    .field({
      name: "website",
      type: TString
    })
  .end()

  const handler = () => ({email: "j.doe@example.com", website: "example.com"})

  const expectedUser = {
    contacts: {
      name: "contacts",
      type: TUserContacts,
      resolve: handler,
      args: [],
      isDeprecated: false,
    }
  }

  const expectedUserWithLogin = {
    login: {
      name: "login",
      type: toRequired(TString),
      args: [],
      isDeprecated: false,
    }
  }

  const TUser = Type("User")
    .resolve({
      name: "contacts",
      type: TUserContacts,
      noArgs: true,
      handler
    })
  .end()

  const TUserWithLogin = Type("UserWithAge", {extends: TUser})
    .field({
      name: "login",
      type: TString,
      required: true
    })
  .end()

  const fields = TUserWithLogin.getFields()

  t.deepEqual(fields, {
    ...expectedUser, ...expectedUserWithLogin
  })
})

test("Should copy resolver argument from parent type", t => {
  t.plan(1)

  const greeter = (_, {name}) => `Hello, ${name}!`

  const TSomeParentType = Type("SomeParentType")
    .resolve({
      name: "greet",
      type: TString,
      required: true,
      handler: greeter
    })
      .arg({
        name: "name",
        type: TString,
        default: "OctetStream"
      })
    .end()
  .end()

  const TSomeChildType = Type("SomeChildType", {extends: TSomeParentType})
    .field({
      name: "hello",
      type: TString,
      required: true
    })
  .end()

  const expected = {
    greet: {
      name: "greet",
      type: toRequired(TString),
      isDeprecated: false,
      resolve: greeter,
      args: [
        {
          name: "name",
          type: TString,
          description: null,
          defaultValue: "OctetStream",
          astNode: undefined
        }
      ]
    },
    hello: {
      name: "hello",
      type: toRequired(TString),
      isDeprecated: false,
      args: []
    }
  }

  const actual = TSomeChildType.getFields()

  t.deepEqual(actual, expected)
})

test("Should add a field with subscription handler", t => {
  t.plan(1)

  const noop = () => {}

  const TSomeType = Type("SomeType")
    .subscribe({
      name: "somethingHappened",
      type: TString,
      required: true,
      handler: noop,
      noArgs: true
    })
  .end()

  const expected = {
    somethingHappened: {
      name: "somethingHappened",
      type: toRequired(TString),
      isDeprecated: false,
      subscribe: noop,
      args: []
    }
  }

  const actual = TSomeType.getFields()

  t.deepEqual(actual, expected)
})

test(
  "Should throw a TypeError when given field options is not a plain object",
  t => {
    t.plan(3)

    // An old syntax is no more supported
    const trap = () => Type("Noop").field("noop", TString, "Noop field")

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message, "Expected an object of the field options. Received string"
    )
  }
)

test("Should throw an error when no field name given", t => {
  t.plan(1)

  const trap = () => Type("Noop").field({})

  t.throws(trap, "Field name is required, but not given.")
})

test(
  "Should throw a TypeError when the given field name is not a string", t => {
    t.plan(3)

    const trap = () => Type("Noop").field({name: 0b101, type: TString})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(err.message, "Field name should be a string. Received number")
  }
)

test("Should throw an error when no field type given", t => {
  t.plan(1)

  const trap = () => Type("Noop").field({name: "noop"})

  t.throws(
    trap,
    "Given options.type property should be one of supported GraphQL types."
  )
})

test(
  "Should throw a TypeError when given type is not one of valid GraphQL types",
  t => {
    t.plan(3)

    const trap = () => Type("Noop").field({name: "noop", type: String})

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

    const trap = () => Type("Noop").field({name: "noop", type: [Number, true]})

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message,
      "Given options.type property should be one of supported GraphQL types."
    )
  }
)
