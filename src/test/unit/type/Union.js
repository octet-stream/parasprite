import test from "ava"

import {
  graphql, GraphQLUnionType,
  GraphQLString as TString,
  GraphQLInt as TInt
} from "graphql"

import {Schema, Union, Type} from "../../../parasprite"

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
        }
      }
    }
  `

  const response = await graphql(schema, query)

  t.deepEqual(response, {
    data: {
      search: {
        author: "Daniel Keyes"
      }
    }
  })
})
