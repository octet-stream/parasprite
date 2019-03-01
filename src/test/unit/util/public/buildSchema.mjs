import p from "path"

import test from "ava"

import pq from "proxyquire"

import {
  GraphQLSchema, GraphQLObjectType,
  GraphQLString as TString
} from "graphql"

import {buildSchema, toRequired, Input} from "parasprite"

const mock = stubs => (
  pq("../../../../lib/util/public/buildSchema", stubs).default
)

const findParentModule = () => __filename

test("Should return a GraphQLSchema instance", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    }
  })

  const schema = build("../../../helper/graphql/schema")

  t.true(schema instanceof GraphQLSchema)
})

test("Should read a schema from absolute path", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    "/path/to/graphql/schema/query/hello.js": {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    }
  })

  const schema = build("/path/to/graphql/schema")

  t.true(schema instanceof GraphQLSchema)
})

test("Should skip non-JS files", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js",
        "some-file.json"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    "/path/to/graphql/schema/query/hello.js": {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    }
  })

  const schema = build("/path/to/graphql/schema")

  t.true(schema instanceof GraphQLSchema)
})

test(
  "Should always have Query field which is instanceof GraphQLObjectType", t => {
    t.plan(2)

    function readdirSync(path) {
      if (path.endsWith("/query")) {
        return [
          "hello.js"
        ]
      }

      const err = new Error("Fake readdir error.")

      err.code = "ENOENT"

      throw err
    }

    const hello = () => "Hello, world!"

    const build = mock({
      fs: {
        readdirSync
      },
      "../internal/findParentModule": {
        default: findParentModule
      },
      [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
        "@noCallThru": true,
        resolve: {
          type: TString,
          handler: hello
        }
      }
    })

    const schema = build("../../../helper/graphql/schema")

    const expectedQueryFields = {
      hello: {
        args: [],
        isDeprecated: false,
        name: "hello",
        type: TString,
        resolve: hello
      }
    }

    const query = schema.getQueryType()

    t.true(query instanceof GraphQLObjectType)
    t.deepEqual(query.getFields(), expectedQueryFields)
  }
)

test("Should skip definitions which have a truthy \"ignore\" flag", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js",
        "greet.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const hello = () => "Hello, world!"

  const greeter = (_, {name}) => `Hello, ${name}!`

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: hello
      }
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/greet.js")]: {
      "@noCallThru": true,
      ignore: true, // The field should be ignored because of this flag
      resolve: {
        type: TString,
        handler: greeter,
        required: true
      }
    }
  })

  const schema = build("../../../helper/graphql/schema")

  const expectedQueryFields = {
    hello: {
      args: [],
      isDeprecated: false,
      name: "hello",
      type: TString,
      resolve: hello
    }
  }

  const query = schema.getQueryType()

  t.deepEqual(query.getFields(), expectedQueryFields)
})

test("Should reolver arguments from a config", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "greet.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const greeter = (_, {name}) => `Hello, ${name}!`

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },

    [p.resolve(__dirname, "../../../helper/graphql/schema/query/greet.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: greeter,
        required: true
      },
      args: {
        name: {
          type: TString,
          required: true
        }
      }
    }
  })

  const schema = build("../../../helper/graphql/schema")

  const expectedQueryFields = {
    greet: {
      isDeprecated: false,
      name: "greet",
      type: toRequired(TString),
      resolve: greeter,
      args: [
        {
          name: "name",
          type: toRequired(TString),
          description: null,
          defaultValue: undefined,
          astNode: undefined
        }
      ]
    }
  }

  const query = schema.getQueryType()

  t.deepEqual(query.getFields(), expectedQueryFields)
})

test(
  "Should ignore Mutation type if there is no definitions on expected path",
  t => {
    t.plan(2)

    function readdirSync(path) {
      if (path.endsWith("/query")) {
        return [
          "hello.js"
        ]
      }

      const err = new Error("Fake readdir error.")

      err.code = "ENOENT"

      throw err
    }

    const build = mock({
      fs: {
        readdirSync
      },
      "../internal/findParentModule": {
        default: findParentModule
      },
      [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
        "@noCallThru": true,
        resolve: {
          type: TString,
          handler: () => "Hello, world!"
        }
      }
    })

    const schema = build("../../../helper/graphql/schema")

    const query = schema.getQueryType()
    const mutation = schema.getMutationType()

    t.true(query instanceof GraphQLObjectType)
    t.is(mutation, undefined)
  }
)

test(
  "Should ignore Mutation and Subscription types if there is " +
  "no definitions on given path, but directory exists.",
  t => {
    t.plan(2)

    function readdirSync(path) {
      if (path.endsWith("/query")) {
        return [
          "hello.js"
        ]
      }

      return []
    }

    const build = mock({
      fs: {
        readdirSync
      },
      "../internal/findParentModule": {
        default: findParentModule
      },
      [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
        "@noCallThru": true,
        resolve: {
          type: TString,
          handler: () => "Hello, world!"
        }
      }
    })

    const schema = build("../../../helper/graphql/schema")

    const mutation = schema.getMutationType()
    const subscription = schema.getSubscriptionType()

    t.is(mutation, undefined)
    t.is(subscription, undefined)
  }
)

test("Should add a Mutation type", t => {
  t.plan(2)

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

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    if (path.endsWith("/mutation")) {
      return [
        "createUser.js"
      ]
    }

    return []
  }

  const createUser = () => {}

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    },
    [p.resolve(
      __dirname, "../../../helper/graphql/schema/mutation/createUser.js"
    )]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        required: true,
        handler: createUser
      },
      args: {
        user: [TUserInput, true]
      }
    }
  })

  const schema = build("../../../helper/graphql/schema")

  const expected = {
    createUser: {
      name: "createUser",
      type: toRequired(TString),
      resolve: createUser,
      isDeprecated: false,
      args: [
        {
          name: "user",
          description: null,
          type: toRequired(TUserInput),
          defaultValue: undefined,
          astNode: undefined
        }
      ]
    }
  }

  const mutation = schema.getMutationType()

  t.true(mutation instanceof GraphQLObjectType)
  t.deepEqual(mutation.getFields(), expected)
})

test("Should add a subscription field", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    if (path.endsWith("/subscription")) {
      return [
        "updatedSomethig.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    },
    [p.resolve(
      __dirname,
      "../../../helper/graphql/schema/subscription/updatedSomethig.js"
    )]: {
      "@noCallThru": true,
      subscribe: {
        type: TString,
        handler() {}
      }
    }
  })

  const schema = build("../../../helper/graphql/schema")

  const subscription = schema.getSubscriptionType()

  t.true(subscription instanceof GraphQLObjectType)
})

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

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    }
  })

  const trap = () => build("../../../helper/graphql/schema")

  const expectedPath = p.resolve(
    __dirname, "../../../helper/graphql/schema/query"
  )

  t.throws(
    trap, `Expected a Query fields, but got nothig. Path: ${expectedPath}`
  )
})

test("Should throw an error for non-ENOENT code", t => {
  t.plan(1)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    throw new Error("Fake readdir error.")
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString,
        handler: () => "Hello, world!"
      }
    }
  })

  const trap = () => build("../../../helper/graphql/schema")

  t.throws(trap)
})

test("Should throw a TypeError when root type have no handler", t => {
  t.plan(3)

  function readdirSync(path) {
    if (path.endsWith("/query")) {
      return [
        "hello.js"
      ]
    }

    const err = new Error("Fake readdir error.")

    err.code = "ENOENT"

    throw err
  }

  const build = mock({
    fs: {
      readdirSync
    },
    "../internal/findParentModule": {
      default: findParentModule
    },
    [p.resolve(__dirname, "../../../helper/graphql/schema/query/hello.js")]: {
      "@noCallThru": true,
      resolve: {
        type: TString
      }
    }
  })

  const trap = () => build("../../../helper/graphql/schema")

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Handler and Subscribe function can't be omitted both.")
})
