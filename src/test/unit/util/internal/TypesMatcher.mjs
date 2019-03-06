import test from "ava"
import sinon from "sinon"

import {GraphQLString as TString, GraphQLObjectType} from "graphql"

import Type from "Type"
import TypesMatcher from "lib/util/internal/TypesMatcher"

test("Calls given mather functions on .exec()", async t => {
  const first = sinon.spy()
  const second = sinon.spy()

  const matcher = new TypesMatcher()

  matcher
    .use(first)
    .use(second)

  await matcher.exec()

  t.true(first.called)
  t.true(second.called)
})

test(".exec() returns null when nothing matched", async t => {
  const matcher = new TypesMatcher()

  matcher.use(() => {})

  const resolvedType = await matcher.exec()

  t.is(resolvedType, null)
})

test(".exec() returns null when matched type is not a object type", async t => {
  const matcher = new TypesMatcher()

  matcher.use(() => TString)

  const resolvedType = await matcher.exec()

  t.is(resolvedType, null)
})

test(".exec() returns matched object type", async t => {
  const matcher = new TypesMatcher()

  const TUser = Type("User")
    .field({
      name: "login",
      type: TString
    })
  .end()

  matcher
    .use(() => TString)
    .use(() => null)
    .use(() => TUser)

  const resolvedType = await matcher.exec()

  t.true(resolvedType instanceof GraphQLObjectType)
  t.is(resolvedType.name, "User")
  t.deepEqual(resolvedType.getFields(), {
    login: {
      name: "login",
      type: TString,
      isDeprecated: false,
      args: []
    }
  })
})

test("Constructor applies matchers from given array", t => {
  sinon.spy(TypesMatcher.prototype, "use")

  const first = () => {}
  const second = () => {}

  const matcher = new TypesMatcher([first, second])

  t.true(matcher.use.calledTwice)

  const [firstActual] = matcher.use.firstCall.args
  const [secondActual] = matcher.use.secondCall.args

  t.is(firstActual, first)
  t.is(secondActual, second)

  matcher.use.restore()
})

test(".exec() calls matcher with given thisValue", async t => {
  const ctx = new Map()
  const fn = sinon.spy()

  await new TypesMatcher().use(fn, ctx).exec()

  t.true(fn.firstCall.thisValue instanceof Map)
})

test(".use() throws a TypeError when given matcher is not a function", t => {
  const matcher = new TypesMatcher()

  const trap = () => matcher.use(113)

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Type matcher must be a function. Received number")
})
