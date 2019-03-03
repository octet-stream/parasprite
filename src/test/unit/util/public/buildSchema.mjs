import p from "path"

import test from "ava"
import sinon from "sinon"
import pq from "proxyquire"

import {
  GraphQLSchema, /* GraphQLObjectType, */
  GraphQLString as TString
} from "graphql"

// import {toRequired, Input} from "parasprite"

const root = p.resolve(process.cwd(), "test/fixture/schema")

const defaultFakeReaddirSync = path => (
  path.endsWith("/query") ? ["noop.js"] : []
)

const noopResolverStub = {
  "@noCallThru": true,

  resolve: {
    type: TString,

    handler: () => null
  }
}

const createBuilderMock = stubs => (
  pq("../../../../lib/util/public/buildSchema", stubs).default
)

test("Returns a GraphQLSchema instance", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },
    [p.join(process.cwd(), "query/noop.js")]: noopResolverStub
  })

  const actual = build()

  t.true(actual instanceof GraphQLSchema)
})

test("Resolves schema from given root path", t => {
  const fake = sinon.spy(defaultFakeReaddirSync)

  const build = createBuilderMock({
    fs: {
      readdirSync: fake
    },

    [p.join(root, "query/noop.js")]: noopResolverStub
  })

  build({root})

  const [actual] = fake.firstCall.args

  t.is(actual, p.join(root, "query"))
})

test("Ignores mutation definitions when there are none of them", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },

    [p.join(root, "query/noop.js")]: noopResolverStub
  })

  const schema = build({root})
  const actual = schema.getMutationType()

  t.deepEqual(actual, undefined)
})

test("Ignores subscription definitions when there are none of them", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },

    [p.join(root, "query/noop.js")]: noopResolverStub
  })

  const schema = build({root})
  const actual = schema.getSubscriptionType()

  t.deepEqual(actual, undefined)
})
