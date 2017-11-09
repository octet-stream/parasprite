# parasprite

Describe your GraphQL schema using chainable interface

[![Mentioned in Awesome GraphQL](https://awesome.re/mentioned-badge.svg)](https://github.com/chentsulin/awesome-graphql)
[![Build Status](https://travis-ci.org/octet-stream/parasprite.svg?branch=master)](https://travis-ci.org/octet-stream/parasprite)
[![Code Coverage](https://codecov.io/github/octet-stream/parasprite/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/parasprite?branch=master)
[![dependencies Status](https://david-dm.org/octet-stream/parasprite/status.svg)](https://david-dm.org/octet-stream/parasprite)
[![devDependencies Status](https://david-dm.org/octet-stream/parasprite/dev-status.svg)](https://david-dm.org/octet-stream/parasprite?type=dev)

**IMPORTANT!** Starting from v1.0.0-beta.1 the parasprite API contain breaking changes
in types declarations and incompatible with the 0.6.x version.
**From 1.x version you should pass a field declaration options in a single object.**

See [API](#api) section for more information.

## Requirements

* Node.js >= 6

* GraphQL.js >=0.10.x (see [installation section](https://github.com/octet-stream/parasprite#installation))

## Installation

You can install parasprite from NPM:

```
npm install --save parasprite graphql@>=0.10.x
```

or YARN:

```
yarn add parasprite graphql@>=0.10.x
```

## API

Parasprite has classes that help you describe GraphQL schema with chains.

**Note: You can invoke these classes without "new" keyword, just like a function**

### `constructor Schema()`

Main class that defines GraphQL schema.

#### Instance methods

##### `query(name[, description]) -> {Type}`

  - **{string}** name – Name for root Query type
  - **{string}** [description = undefined] – Description for root Query type

Define Query with given name and description.

##### `mutation(name[, description]) -> {Type}`

  - **{string}** name – Name for root Mutation type
  - **{string}** [description = undefined] – Description for root Mutation type

Define Mutation with given name and description.

##### `subscription(name[, description]) -> {Type}`

  - **{string}** name – Name for root Subscription type
  - **{string}** [description = undefined] – Description for root Subscription type

Define Subscription with given name and description.

##### `end() -> {GraphQLSchema}`

Make GraphQLSchema.

### `constructor Type`

This class helps you describe GraphQLObjectType. there is 3 different syntaxes:

#### `Type(options)`

  - **{object}** options
    + **{string}** name – Name for the type
    + **{string}** [description = null]
    + **{GrphQLInterfaceType | GrphQLInterfaceType[]}** [interfaces = null]
    + **{GraphQLObjectType}** [extends = null]
    + **{Function}** [isTypeOf = null]

#### `Type(name[, options])`

  - **{string}** name
  - **{object}** options
    + **{string}** [description = null]
    + **{GrphQLInterfaceType | GrphQLInterfaceType[]}** [interfaces = null]
    + **{GraphQLObjectType}** [extends = null]
    + **{Function}** [isTypeOf = null]

#### `Type(name[, description, options])`

  - **{string}** name
  - **{string}** [description = null]
  - **{object}** options
    + **{GrphQLInterfaceType | GrphQLInterfaceType[]}** [interfaces = null]
    + **{GraphQLObjectType}** [extends = null]
    + **{Function}** [isTypeOf = null]

#### Instance methods

##### `field(options) -> {Type}`

Define one field on **GraphQLObjectType**. Returns current instance of **Type** class.

  - **{object}** options – A field declaration options with the following properties:
    + **{string}** name
    + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
    + **{string}** [description = undefined]
    + **{string}** [deprecationReason = undefined]
    + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.

##### `resolve(options) -> {Resolve}`

Add a new **resolve** field with the handler.

  - **{object}** options – A field declaration options with the following properties:
    + **{string}** name
    + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
    + **{string}** [description = undefined]
    + **{string}** [deprecationReason = undefined]
    + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.
    + **{Function}** handler – a function that will be used as resover for this field

##### `subscribe(options) -> {Resolve}`

Add a new **subscribe** field with the handler.

  - **{object}** options – A field declaration options with the following properties:
    + **{string}** name
    + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
    + **{string}** [description = undefined]
    + **{string}** [deprecationReason = undefined]
    + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.
    + **{Function}** handler – a function that will be used as subscriber for this field

##### `end() -> {GraphQLObjectType}`

Make a `GraphQLObjectType`.

### `constructor Input(name[, description])`

  - **{string}** name – Name for object type
  - **{string}** description – Description for object type

#### Instance methods

##### `field(options) -> {Input}`

  - **{object}** options – A field declaration options with the following properties:
    + **{string}** name
    + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
    + **{string}** [description = undefined]
    + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.
    + **{any}** [defaultValue = undefined] – default value for this field (`undefined` means there is no default value)

### `constructor Interface(name[, description], resolveType)`

Create a custum GraphQLInterfaceType using Parasprite chainable API

See [Type](https://github.com/octet-stream/parasprite#constructor-typename-description-interfaces-istypeof) section for more info about available methods.

## Utils

##### `toListType(value) -> {GraphQLList}`

Create GraphQLList from given array or value

##### `toRequired(value) -> {GraphQLNonNull}`

Mark given value as non-null.

##### `buildSchema(path[, options]) -> {GraphQLSchema}`

Build a GraphQLSchema by reading the definitions from given directory.

  - **{string}** path – An absolute or relative path to the directory with the schema definitions.
  - **{object}** [options = {}] – Advanced parameters for that utility.
    + **{object}** query – Options for a Query definitions:
      - **{string}** [name = "Query"] – The name of Query type
      - **{string}** [dir = "query"] – The subdirectory name from where definitions would be read.
    + **{object}** mutation – Options for a Mutation definitions:
      - **{string}** [name = "Mutation"] – The name of Mutation type
      - **{string}** [dir = "mutation"] – The subdirectory name from where definitions would be read.
    + **{object}** subscription – Options for a Subscription definitions:
      - **{string}** [name = "Subscription"] – The name of Subscription type
      - **{string}** [dir = "subscription"] – The subdirectory name from where definitions would be read.

## Usage

1. Basically, all you need is to describe GraphQLSchema
   is a Schema class and GraphQL internal types:

Take a look at simple example with a resolver that just greets a user:

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema from "parasprite"

const greeter = (_, {name}) => `Hello, ${name}!`

const schema = Schema()
  .query("Query")
    .resolve({
      name: "greeter",
      type: TString,
      required: true,
      handler: greeter
    })
      .arg("name", TString, true)
    .end()
  .end()
.end()
```

This schema is equivalent to the following code in GraphQL schema language:

```graphql
type Query {
  greeter(name: String!): String!
}

schema {
  query: Query
}
```

2. More complex example with `Type` class usage:

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema, {Type} from "parasprite"
import Project from "model/Project" // Whatever model you need

const Project = Type("Project")
  .field({
    name: "name",
    type: TString,
    description: "Project name"
  })
  .field({
    name: "tagline",
    type: TString
  })
.end()

const schema = Schema()
  .query("Query")
    .resolve({
      name: "project",
      type: Project,
      description: "Get the project by his name",
      handler: Project.findProjectByName
    })
      .arg({
        name: "name",
        type: TString
      })
    .end()
  .end()
.end()
```

Equivalent to:

```graphql
type Project {
  # Project name
  name: String
  tagline: String
}

type Query {
  # Get the project by his name
  project(name: String): Project
}

schema {
  query: Query
}
```

3. You can also pass a GraphQLObject type to the Schema root fields:

```js
import {GraphQLString as TString} from "graphql"

import Schema from "parasprite/Schema"
import Type from "parasprite/Type"

const greeter = (_, {name}) => `Hello, ${name}!`

const TQuery = Type("Query")
  .resolve({
    name: "greet",
    type: TString,
    required: true,
    handler: greeter
  })
    .arg({
      name: "name",
      type: TString
    })
.end()

const schema = Schema().query(TQuery).end() // That's all!
```

4. Parasprite allow to extend GraphQLObjectType by using an **extends** option in **Type** constructor:

```js
import {GraphQLString as TString, GraphQLInt as TInt} from "graphql"

import Type from "parasprite/Type"

const TUser = Type("User")
  .field({
    name: "login",
    type: TString,
    required: true
  })
  .field({
    name: "age",
    type: TInt,
    required: true
  })
.end()

const TViewer = Type("Viewer", {extends: TUser})
  .field({
    name: "email",
    type: TString,
    required: true,
    description: "Private email address."
  })
.end()
```

On GraphQL language:

```graphql
type User {
  login: String!
  age: Int!
}

type Viewer {
  login: String!
  age: Int!

  # Private email address.
  email: String!
}
```

## Roadmap:

  - [x] ~~Basic API with queries, mutations and object type~~;
  - [x] ~~Input types~~;
  - [x] ~~Test~~;
  - [x] ~~Interfaces~~ (documentation in progress);
  - [x] ~~Extending for Type~~;
  - [ ] Documentation (still in progress);
  - [ ] Complex working examples (as external repo)

## Misc

Wanted to learn more about GraphQL or try another tools?
Then visit [awesome-graphql](https://github.com/chentsulin/awesome-graphql) list! :)
