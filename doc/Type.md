# class Type

Helps you to descibe GraphQLObjectType.

## Usage

A miniamal example of Type class usage:

```js
import {GraphQLString as TString} from "graphql"
import {Type} from "parasprite"

const TUser = Type("User", "Represents public information about user")
  .field({
    name: "login",
    type: TString,
    required: true
  })
.end()
```

Equivalent of the above code in GraphQL SDL:

```gql
type User {
  name: String!
}
```

Type class can create a new type with fields of another. Use `params.extends` for that:

```js
import {GraphQLString as TString, GraphQLInt as TInt} from "graphql"

// This package also exposes separated entry points for each piece of public API
import Type from "parasprite/Type"

const TUserMinimal = Type({name: "UserMinimal"})
  .field({
    name: "name",
    type: TString,
    required: true
  })
  .field({
    name: "age",
    type: TInt,
    required: true
  })
.end()

const TUser = Type({name: "User", extends: TUserMinimal})
  .field({
    name: "bio",
    type: TString
  })
.end()
```

Same thing on SDL:

```gql
type UserMinimal {
  name: String!
  age: Int!
}

type User {
  name: String!
  age: Int!
  bio: String
}
```

This small feature allows you to reuse declared types as the part of the others.

## API

### `constructor(name[, description, params]) -> {Type}`

- **{string}** name – type name
- **{string}** description – type description
- **{object}** params – advenced parameters of a type
- **{GraphQLObjectType}** params.extends – a GraphQLObjectType which fields and resolver will be used as initial fields

### `constructor(name[, params]) -> {Type}`

- **{string}** name – type name
- **{object}** params – advenced parameters of a type
- **{string}** params.description – type description
- **{GraphQLObjectType}** params.extends – a GraphQLObjectType which fields and resolver will be used as initial fields

### `constructor(params) -> {Type}`

- **{object}** params – initial parameters of a type
- **{string}** params.name – type name
- **{string}** params.description – type description
- **{GraphQLObjectType}** params.extends – a GraphQLObjectType which fields and resolver will be used as initial fields

### Instance methods

#### `field(options) -> {Type}`

Appends a field on **GraphQLObjectType**. Returns current instance of **Type** class.

- **{object}** options – A field declaration options with the following properties:
  + **{string}** name
  + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
  + **{string}** [description = undefined]
  + **{string}** [deprecationReason = undefined]
  + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.

#### `resolve(options) -> {Resolve}`

Appends a new **resolve** field with the handler.

- **{object}** options – A field declaration options with the following properties:
  + **{string}** name
  + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
  + **{string}** [description = undefined]
  + **{string}** [deprecationReason = undefined]
  + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.
  + **{Function}** handler – a function that will be used as resover for this field

#### `subscribe(options) -> {Resolve}`

Appends a new **subscribe** field with the handler.

- **{object}** options – A field declaration options with the following properties:
  + **{string}** name
  + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
  + **{string}** [description = undefined]
  + **{string}** [deprecationReason = undefined]
  + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.
  + **{Function}** handler – a function that will be used as subscriber for this field

#### `end() -> {GraphQLObjectType}`

Creates a `GraphQLObjectType` using previously added fields from Type.
