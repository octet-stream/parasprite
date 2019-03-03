import p from "path"

import test from "ava"
import sinon from "sinon"
import pq from "proxyquire"

import {
  GraphQLSchema, /* GraphQLObjectType, */
  GraphQLString as TString
} from "graphql"

import {Input, toRequired} from "parasprite"

const root = p.resolve(process.cwd(), "test/fixture/schema")

const defaultFakeReaddirSync = path => (
  path.endsWith("/query") ? ["noop.js"] : []
)

const noopHandler = () => null

const noopResolverStub = {
  "@noCallThru": true,

  resolve: {
    type: TString,

    handler: noopHandler
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

test("Ignores Mutation definitions when there are none of them", t => {
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

test("Ignores Subscription definitions when there are none of them", t => {
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

test("Ignores unknown file extensions", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: path => (
        path.endsWith("/query") ? ["noop.js", "unknown.file"] : []
      )
    },

    [p.join(root, "query/noop.js")]: noopResolverStub,

    [p.join(root, "query/unknown.file")]: noopResolverStub
  })

  const actual = build({root}).getQueryType().getFields()

  t.deepEqual(actual, {
    noop: {
      name: "noop",
      type: TString,
      isDeprecated: false,
      args: [],

      resolve: noopHandler
    }
  })
})

test("Ignores definitions with \"ignore\" flag", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: path => (
        path.endsWith("/query") ? ["noop.js", "user.js"] : []
      )
    },

    [p.join(root, "query/noop.js")]: {
      "@noCallThru": true,

      ignore: true, // the definition with such flag will be ignored
      resolve: {
        type: TString,

        handler: () => {}
      }
    },

    [p.join(root, "query/user.js")]: noopResolverStub
  })

  const actual = build({root}).getQueryType().getFields()

  t.deepEqual(actual, {
    user: {
      name: "user",
      type: TString,
      isDeprecated: false,
      args: [],

      resolve: noopHandler
    }
  })
})

test("Correctly creates resolver with arguments", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },

    [p.join(root, "query/noop.js")]: {
      "@noCallThru": true,

      args: {
        name: TString
      },

      resolve: {
        type: TString,
        handler: noopHandler
      }
    }
  })

  const actual = build({root}).getQueryType().getFields()

  t.deepEqual(actual, {
    noop: {
      name: "noop",
      type: TString,
      isDeprecated: false,
      args: [{
        name: "name",
        description: null,
        type: TString,
        defaultValue: undefined,
        astNode: undefined
      }],

      resolve: noopHandler
    }
  })
})

test("Allows to mark argument type as required usting array syntax", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },

    [p.join(root, "query/noop.js")]: {
      "@noCallThru": true,

      args: {
        name: [TString, true]
      },

      resolve: {
        type: TString,
        handler: noopHandler
      }
    }
  })

  const actual = build({root}).getQueryType().getFields()

  t.deepEqual(actual, {
    noop: {
      name: "noop",
      type: TString,
      isDeprecated: false,
      args: [{
        name: "name",
        description: null,
        type: toRequired(TString),
        defaultValue: undefined,
        astNode: undefined
      }],

      resolve: noopHandler
    }
  })
})

test("Throws a TypeError when there are no handlers", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: defaultFakeReaddirSync
    },

    [p.join(root, "query/noop.js")]: {
      "@noCallThru": true,

      resolve: {
        type: TString
      }
    }
  })

  const trap = () => build({root})

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Handler and Subscribe function can't be omitted both.")
})

test("Throws an error when no Query definitions found", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: () => []
    }
  })

  const err = t.throws(build)

  t.is(
    err.message,
    `Expected a Query definitions, but got nothig. Path: ${process.cwd()}/query`
  )
})
