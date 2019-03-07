import test from "ava"
import sinon from "sinon"
import pq from "proxyquire"

import {graphql, GraphQLInterfaceType, GraphQLString as TString} from "graphql"

import {Schema, Interface, Type, toListType, toRequired} from "parasprite"

import TypesMatcher from "lib/util/internal/TypesMatcher"

const DATA_SOURCE = [
  {
    name: "Anon",
    age: NaN,
    city: "Unknown"
  }
]

const handler = (_, {name}) => DATA_SOURCE.find(user => user.name === name)

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

test("Allows to set resolveType function as TypesMatcher instance", async t => {
  // eslint-disable-next-line no-use-before-define
  const matcher = new TypesMatcher([() => TUser])

  sinon.spy(matcher, "exec")

  const IInterf = Interface("Interface", matcher)
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const TUser = Type({name: "User", interfaces: [IInterf]})
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const schema = Schema({types: [TUser]})
    .query("Query")
      .resolve({
        name: "user",
        type: IInterf,
        required: true,
        handler
      })
        .arg({
          name: "name",
          type: TString,
          required: true
        })
      .end()
    .end()
  .end()

  const query = `
    query {
      user(name: "Anon") {
        name
      }
    }
  `

  const [expected] = DATA_SOURCE

  const response = await graphql(schema, query)

  t.true(matcher.exec.called)

  const [user] = matcher.exec.firstCall.args

  t.deepEqual(user, expected)
  t.deepEqual(response, {
    data: {
      user: {name: expected.name}
    }
  })

  matcher.exec.restore()
})

test("Allows to set resolveType as a function", async t => {
  // eslint-disable-next-line no-use-before-define
  const noop = sinon.spy(() => Promise.resolve(TUser))

  const FakeMatcher = sinon.spy(TypesMatcher)

  const MockedInterface = pq("../../../lib/type/Interface", {
    "../util/internal/TypesMatcher": {
      default: FakeMatcher
    }
  }).default

  const IInterf = MockedInterface("Interface", noop)
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const TUser = Type({name: "User", interfaces: [IInterf]})
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const schema = Schema({types: [TUser]})
    .query("Query")
      .resolve({
        name: "user",
        type: IInterf,
        required: true,
        handler
      })
        .arg({
          name: "name",
          type: TString,
          required: true
        })
      .end()
    .end()
  .end()

  const query = `
    query {
      user(name: "Anon") {
        name
      }
    }
  `

  t.true(FakeMatcher.called)

  const [actual] = FakeMatcher.firstCall.args

  t.deepEqual(actual, [noop])

  const [expectedUser] = DATA_SOURCE

  const response = await graphql(schema, query)

  t.true(noop.called)

  const [user] = noop.firstCall.args

  t.deepEqual(user, expectedUser)
  t.deepEqual(response, {
    data: {
      user: {name: expectedUser.name}
    }
  })
})

test("Allows to set resolveType as an array", async t => {
  // eslint-disable-next-line no-use-before-define
  const noop = sinon.spy(() => Promise.resolve(TUser))

  const FakeMatcher = sinon.spy(TypesMatcher)

  const MockedInterface = pq("../../../lib/type/Interface", {
    "../util/internal/TypesMatcher": {
      default: FakeMatcher
    }
  }).default

  const IInterf = MockedInterface("Interface", [noop])
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const TUser = Type({name: "User", interfaces: [IInterf]})
    .field({
      name: "name",
      type: TString,
      required: true
    })
  .end()

  const schema = Schema({types: [TUser]})
    .query("Query")
      .resolve({
        name: "user",
        type: IInterf,
        required: true,
        handler
      })
        .arg({
          name: "name",
          type: TString,
          required: true
        })
      .end()
    .end()
  .end()

  const query = `
    query {
      user(name: "Anon") {
        name
      }
    }
  `

  t.true(FakeMatcher.called)

  const [actual] = FakeMatcher.firstCall.args

  t.deepEqual(actual, [noop])

  const [expectedUser] = DATA_SOURCE

  const response = await graphql(schema, query)

  t.true(noop.called)

  const [user] = noop.firstCall.args

  t.deepEqual(user, expectedUser)
  t.deepEqual(response, {
    data: {
      user: {name: expectedUser.name}
    }
  })
})
