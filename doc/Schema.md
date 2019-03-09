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
