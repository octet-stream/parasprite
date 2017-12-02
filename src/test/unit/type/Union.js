import test from "ava"

import {spy} from "sinon"
import {
  graphql, GraphQLUnionType,
  GraphQLString as TString,
  GraphQLInt as TInt
} from "graphql"

import {Schema, Union, Type} from "../../../parasprite"

import U from "../../../Union"

const DATA_SOURCE = [
  {
    author: "Daniel Keyes",
    title: "Flowers for Algernon",
    pages: 311
  },
  {
    director: "Christopher Nolan",
    title: "Interstellar",
    runningTime: 169
  }
]

const TBook = Type("Book")
  .field({
    name: "author",
    type: TString,
    required: true
  })
  .field({
    name: "title",
    type: TString,
    required: true
  })
  .field({
    name: "pages",
    type: TInt,
    required: true
  })
.end()

const TMovie = Type("Movie")
  .field({
    name: "director",
    type: TString,
    required: true
  })
  .field({
    name: "title",
    type: TString,
    required: true
  })
  .field({
    name: "runningTime",
    type: TInt,
    required: true
  })
.end()

const handler = (_, {name}) => (
  DATA_SOURCE.find(({author, director, username}) => (
    [author, director, username].includes(name)
  ))
)

test("Should return a GraphQLUnionType", t => {
  t.plan(1)

  const TSearchable = Union("Searchable", [TBook])
    .match(({author}) => author && TBook)
  .end()

  t.true(TSearchable instanceof GraphQLUnionType)
})

test(
  "Should correctly create a GraphQLUnionType when constructor takes an object",
  t => {
    t.plan(1)

    const TSearchable = Union({
      name: "Searchable",
      description: "Represents a union searchable type.",
      types: [TBook]
    })
      .match(({author}) => author && TBook)
    .end()

    t.true(TSearchable instanceof GraphQLUnionType)
  }
)

test("Should correctly resolve a type", async t => {
  const TSearchable = Union("Searchable", [TBook, TMovie])
    .match(({director, runningTime}) => (director && runningTime) && TMovie)
    .match(({author, pages}) => (author && pages) && TBook)
  .end()

  const schema = Schema()
    .query("Query")
      .resolve({
        name: "search",
        type: TSearchable,
        handler,
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
      search(name: "Daniel Keyes") {
        ... on Book {
          author
          title
          pages
        }
      }
    }
  `

  const response = await graphql(schema, query)

  t.deepEqual(response, {
    data: {
      search: {
        author: "Daniel Keyes",
        title: "Flowers for Algernon",
        pages: 311
      }
    }
  })
})

test("Should call predicate with given context", async t => {
  t.plan(3)

  const ctx = new Map()

  function matchMovie({director, runningTime}) {
    return director && runningTime ? TMovie : null
  }

  const spyoMatchMovie = spy(matchMovie)

  const TSearchable = Union("Searchable", [TBook, TMovie])
    .match(({author, pages}) => (author && pages) && TBook)
    .match(spyoMatchMovie, ctx)
  .end()

  const schema = Schema()
    .query("Query")
      .resolve({
        name: "search",
        type: TSearchable,
        handler,
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
      search(name: "Christopher Nolan") {
        ... on Movie {
          director
          title
          runningTime
        }
      }
    }
  `

  const response = await graphql(schema, query)

  const actualCtx = spyoMatchMovie.lastCall.thisValue

  t.true(actualCtx instanceof Map)
  t.deepEqual(actualCtx, ctx)

  t.deepEqual(response, {
    data: {
      search: {
        director: "Christopher Nolan",
        title: "Interstellar",
        runningTime: 169
      }
    }
  })
})

test("Should throw an error when name not given", t => {
  t.plan(1)

  const trap = () => Union()

  t.throws(trap, "Union type constructor requires a name.")
})

test(
  "Should should throw an error when the name property omitted on given object",
  t => {
    t.plan(1)

    const trap = () => Union({
      description: "Some description",
      types: [TBook, TMovie]
    })

    t.throws(trap, "Union type constructor requires a name.")
  }
)

test("Should throw a TypeError when given name is not a string", t => {
  t.plan(3)

  const trap = () => Union(451)

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "The name should be a string. Received number")
})

test("Should throw an error when the name property is not a string", t => {
  const trap = () => Union({
    name: 451
  })

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "The name should be a string. Received number")
})

test("Should throw an error when no types list given", t => {
  t.plan(1)

  const trap = () => Union("Searchable")

  t.throws(trap, "Types list required.")
})

test(
  "Should throw a TypeError when given types list contain a wrong type",
  t => {
    t.plan(3)

    const trap = () => Union("Searchable", [TBook, Map, TMovie])

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(
      err.message, "Given list should contain only GraphQLObjectType instances."
    )
  }
)

test(
  "Should throw an error when the types property omitted on given object",
  t => {
    t.plan(1)

    const trap = () => Union({
      name: "Searchable"
    })

    t.throws(trap, "Types list required.")
  }
)

test(
  "Method .match() should throw a TypeError " +
  "when given predicate is not a function",
  t => {
    t.plan(3)

    const trap = () => (
      Union("Searchable", [TBook]).match("totally not a function").end()
    )

    const err = t.throws(trap)

    t.true(err instanceof TypeError)
    t.is(err.message, "Predicate should be a function. Received string")
  }
)
