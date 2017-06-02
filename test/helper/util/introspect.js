import {resolve} from "path"

import test from "ava"
import pq from "proxyquire"
import {GraphQLString as TString} from "graphql"

import Schema from "parasprite"

import introspect from "helper/util/introspect"

const mockIntrospectHelperDeps = (deps = {}) => pq(
  resolve(__dirname, "..", "..", "..", "helper/util/introspect"), {
    ...deps
  }
)

const schema = Schema()
  .query("Query")
    .resolve("phrase", TString, true, () => "Let's go, pal.")
    .end()
  .end()
.end()

test("Should have additional methods on default export", t => {
  t.plan(2)

  t.is(typeof introspect.asObject, "function")
  t.is(typeof introspect.asJSON, "function")
})

test("Should return a promise", t => {
  t.plan(1)

  const introspect = mockIntrospectHelperDeps({
    fs: {
      writeFile() {
        // noop
      }
    }
  })

  const res = introspect.default(schema, __dirname, {spaces: 2})

  t.true(res instanceof Promise)
})
