import {resolve} from "path"

import test from "ava"

import pq from "proxyquire"

import {GraphQLSchema, GraphQLObjectType as TObject} from "graphql"

import {buildSchema} from "../../../../parasprite"

const mock = stubs => (
  pq("../../../../lib/util/public/buildSchema", stubs).default
)

test("Should return a GraphQLSchema instance", t => {
  t.plan(1)

  const schema = buildSchema("../../../helper/graphql/schema")

  t.true(schema instanceof GraphQLSchema)
})

test(
  "Should always have Query field which is instanceof GraphQLObjectType", t => {
    t.plan(1)

    const schema = buildSchema("../../../helper/graphql/schema")

    t.true(schema.getQueryType() instanceof TObject)
  }
)

test(
  "Should throw an error when the schema root directory path is not given",
  t => {
    t.plan(1)

    t.throws(buildSchema, "Required a path to the schema root directory.")
  }
)

test(
  "Should throw a TypeError when the given root directory path is no a string",
  t => {
    t.plan(3)

    const trap = () => buildSchema(256)

    const err = t.throws(trap)

    t.true(err instanceof TypeError)

    t.is(
      err.message,
      "The root directory path should be a string. Received number"
    )
  }
)

test("Should throw a TypeError when given options is not an object", t => {
  t.plan(3)

  const trap = () => buildSchema("../../../helper/graphql/schema", [])

  const err = t.throws(trap)

  t.true(err instanceof TypeError)

  t.is(err.message, "Options should be a plain object. Received array")
})

test("Should throw an error when no query field found", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return []
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const findParentModule = () => __filename

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    }
  })

  const trap = () => build("../../../helper/graphql/schema")

  const expectedPath = resolve(
    __dirname, "../../../helper/graphql/schema/query"
  )

  t.throws(
    trap, `Expected a Query fields, but got nothig. Path: ${expectedPath}`
  )
})
