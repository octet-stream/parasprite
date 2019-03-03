import p from "path"

import test from "ava"
import sinon from "sinon"
import pq from "proxyquire"

import {
  GraphQLSchema, GraphQLObjectType,
  GraphQLString as TString
} from "graphql"

import {toRequired, Input} from "parasprite"

const root = p.resolve(process.cwd(), "test/fixture/schema")

const createBuilderMock = stubs => (
  pq("../../../../lib/util/public/buildSchema", stubs).default
)

test("Should return a GraphQLSchema instance", t => {
  const build = createBuilderMock({
    fs: {
      readdirSync: path => path.endsWith("/query") ? ["hello.js"] : []
    },
    [p.join(process.cwd(), "query/hello.js")]: {
      "@noCallThru": true,

      resolve: {
        type: TString,

        handler: () => "Hello, world!"
      }
    }
  })

  const actual = build()

  t.true(actual instanceof GraphQLSchema)
})

test("Should resolve schema from given root path", t => {
  const fake = sinon.spy(path => path.endsWith("/query") ? ["noop.js"] : [])

  const build = createBuilderMock({
    fs: {
      readdirSync: fake
    },

    [p.join(root, "query/noop.js")]: {
      "@noCallThru": true,

      resolve: {
        type: TString,

        handler: () => null
      }
    }
  })

  build({root})

  const [actual] = fake.firstCall.args

  t.is(actual, p.join(root, "query"))
})
