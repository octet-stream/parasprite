# class Schema

Defines GraphQLSchema.

## Usage

A miniaml example of Schema usage:

```js
import {GraphQLString as TString} from "graphql"

import Schema from "parasprite"

const schema = Schema()
  .query("Query")
    .resolve({
      name: "hello",
      type: TString,
      required: true,
      noArgs: true,

      handler: () => "Hello, World!"
    })
  .end()
.end()
```

Equivalent of the above code in GraphQL SDL:

```gql
type Query {
  hello: String!
}

schema {
  query: Query!
}
```

## API

#### `constructor([options]) -> {Schema}`

- **{object}** options – options to use in GraphQLSchema constructor
- **{GraphQLObjectType | GraphQLObjectType[]}** options.types – a set of GraphQLObjectType

### Instance methods

#### `query(name[, description]) -> {Type}`

Define Query with given name and description.

- **{string}** name – Name for root Query type
- **{string}** [description = undefined] – Description for root Query type

#### `query(name[, params]) -> {Type}`

- **{string}** name – type name
- **{object}** params – advenced parameters of a type

#### `query(params) -> {Type}`

- **{object}** params – initial parameters of a type
- **{string}** params.name – type name

#### `query(type) -> {Schema}`

- **{GraphQLObjectType}** type – GraphQLObjectType to use as Query field

#### `mutation(name[, description]) -> {Type}`

Define Mutation with given name and description.

- **{string}** name – Name for root Mutation type
- **{string}** [description = undefined] – Description for root Mutation type

#### `mutation(name[, params]) -> {Type}`

- **{string}** name – type name
- **{object}** params – advenced parameters of a type

#### `mutation(params) -> {Type}`

- **{object}** params – initial parameters of a type
- **{string}** params.name – type name

#### `mutation(type) -> {Schema}`

- **{GraphQLObjectType}** type – GraphQLObjectType to use as Mutation field

#### `subscription(name[, description]) -> {Type}`

Define Subscription with given name and description.

- **{string}** name – Name for root Subscription type
- **{string}** [description = undefined] – Description for root Subscription type

#### `subscription(name[, params]) -> {Type}`

- **{string}** name – type name
- **{object}** params – advenced parameters of a type

#### `subscription(params) -> {Type}`

- **{object}** params – initial parameters of a type
- **{string}** params.name – type name

#### `subscribe(type) -> {Schema}`

- **{GraphQLObjectType}** type – GraphQLObjectType to use as Subscribe field

#### `end() -> {GraphQLSchema}`

Make GraphQLSchema.
