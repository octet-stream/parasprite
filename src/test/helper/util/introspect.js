import test from "ava"
import pq from "proxyquire"
import {GraphQLString as TString} from "graphql"

import Schema from "parasprite"

import introspect from "helper/util/introspect"

const mockIntrospectHelperDeps = (deps = {}) => pq(
  "../../../helper/util/introspect", {
    ...deps
  }
)

const schema = Schema()
  .query("Query")
    .resolve({
      name: "phrase",
      type: TString,
      required: true,
      handler: () => "Let's go, pal."
    })
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

  const mockedIntrospect = mockIntrospectHelperDeps({
    fs: {
      writeFile() {
        // noop
      }
    }
  })

  const res = mockedIntrospect.default(schema, __dirname, {spaces: 2})

  t.true(res instanceof Promise)
})
