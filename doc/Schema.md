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
  query: Query
}
```

## API

### `constructor([options]) -> {Schema}`

### Instance methods

#### `query(name[, description]) -> {Type}`

- **{string}** name – Name for root Query type
- **{string}** [description = undefined] – Description for root Query type

Define Query with given name and description.

#### `mutation(name[, description]) -> {Type}`

- **{string}** name – Name for root Mutation type
- **{string}** [description = undefined] – Description for root Mutation type

Define Mutation with given name and description.

#### `subscription(name[, description]) -> {Type}`

- **{string}** name – Name for root Subscription type
- **{string}** [description = undefined] – Description for root Subscription type

Define Subscription with given name and description.

#### `end() -> {GraphQLSchema}`

Make GraphQLSchema.
