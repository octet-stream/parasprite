# class Union

Defines a new GraphQLUnionType

## Usage

```js
import {GraphQLString as TString, GraphQLInt as TInt} from "graphql"
import {Union, Type} from "parasprite"

const TBook = Type("Book", "Minimal imformation of a book.")
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

const TMovie = Type("Movie", "Minimal imformation of a movie.")
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

const TSearchable = Union("Searchable", [TBook, TMovie])
  .match(({author, pages}) => (author && pages) && TBook)
  .match(({director, runningTime}) => (director && runningTime) && TMovie)
.end()

export default TSearchable
```

## API

#### `constructor(name[, description], types]) -> {Union}`

- **{string}** name – union type name
- **{string}** [description = undefined] – union type description
- **{Array<GraphQLObjectType>}** types – a list of types that union type can resolve

#### `constructor(name, types) -> {Union}`

- **{string}** name – union type name
- **{Array<GraphQLObjectType>}** types – a list of types that union type can resolve

#### `constructor(options) -> {Union}`

- **{object}** options – initial parameters of union type
- **{string}** options.name – union type name
- **{string}** [options.description = undefined] – union type description
- **{Array<GraphQLObjectType>}** types – a list of types that union type can resolve

### Instance methods

#### `match(matcher) -> {Union}`

Adds a function that will be used to match possible types.
Given function a can return a Promise.

- **{function}** matcher – function to use as a type matcher.
  If GraphQLObjectType is returned, it will be used as the result of Union typed field.
  Any other returned value will be ignored.

#### `end() -> {GraphQLUnionType}`
