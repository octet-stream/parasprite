import test from "ava"
import sinon from "sinon"

import {
  graphql, GraphQLUnionType,
  GraphQLString as TString,
  GraphQLInt as TInt
} from "graphql"

import {Schema, Union, Type} from "parasprite"

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

test("Returns a GraphQLUnionType after .end() call", t => {
  const TSearchable = Union("Searchable", [TBook])
    .match(({author}) => author && TBook)
  .end()

  t.true(TSearchable instanceof GraphQLUnionType)
})

test("Takes union type parameters from given object", t => {
  const TSearchable = Union({
    name: "Searchable",
    description: "Represents a union searchable type.",
    types: [TBook]
  })
    .match(({author}) => author && TBook)
  .end()

  t.true(TSearchable instanceof GraphQLUnionType)
})

test("Resolves matched type", async t => {
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

test("Executes predicate with given context", async t => {
  const ctx = new Map()

  function matchMovie({director, runningTime}) {
    return director && runningTime ? TMovie : null
  }

  const spyoMatchMovie = sinon.spy(matchMovie)

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

test("Throws an error when the name was not given", t => {
  const trap = () => Union()

  t.throws(trap, "Union type constructor requires a name.")
})

test("Throws an error when the name property omitted on given object", t => {
  const trap = () => Union({
    description: "Some description",
    types: [TBook, TMovie]
  })

  t.throws(trap, "Union type constructor requires a name.")
})

test("Throws a TypeError when given name is not a string", t => {
  const trap = () => Union(451)

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "The name should be a string. Received number")
})

test("Throws an error when the name property is not a string", t => {
  const trap = () => Union({
    name: 451
  })

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "The name should be a string. Received number")
})

test("Throws an error when no types list given", t => {
  const trap = () => Union("Searchable")

  t.throws(trap, "Types list required.")
})

test("Throws a TypeError when given types list contain a wrong type", t => {
  const trap = () => Union("Searchable", [TBook, Map, TMovie])

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(
    err.message, "Given list should contain only GraphQLObjectType instances."
  )
})

test("Throws an error when the types property omitted on given object", t => {
  const trap = () => Union({
    name: "Searchable"
  })

  t.throws(trap, "Types list required.")
})

test(".match() throws a TypeError when predicate is not a function", t => {
  t.plan(3)

  const trap = () => (
    Union("Searchable", [TBook]).match("totally not a function").end()
  )

  const err = t.throws(trap)

  t.true(err instanceof TypeError)
  t.is(err.message, "Type matcher must be a function. Received string")
})
