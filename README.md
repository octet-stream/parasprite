# parasprite

Describe your GraphQL schema using chainable interface

[![dependencies Status](https://david-dm.org/octet-stream/parasprite/status.svg)](https://david-dm.org/octet-stream/parasprite)
[![devDependencies Status](https://david-dm.org/octet-stream/parasprite/dev-status.svg)](https://david-dm.org/octet-stream/parasprite?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/parasprite.svg?branch=master)](https://travis-ci.org/octet-stream/parasprite)
[![Code Coverage](https://codecov.io/github/octet-stream/parasprite/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/parasprite?branch=master)

## Requirements

* Node.js >= 6

* GraphQL.js 0.10.x (see [installation section](https://github.com/octet-stream/parasprite#installation))

## Installation

You can install parasprite from NPM:

```sh
npm install --save parasprite graphql@0.10.x
```

or YARN:

```
yarn add parasprite graphql@0.10.x
```

## Usage

**Note: All examples were written with ES modules syntax.**

Basically, all you need is to describe GraphQLSchema
is a Schema class and GraphQL internal types:

Take a look at simple example with a resolver that just greets a user:

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema from "parasprite"

const greeter = (_, {name}) => `Hello, ${name}!`

const schema = Schema()
  .query("Query")
    .resolve("greeter", TString, true, greeter)
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

More complex example with `Type` class usage:

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema, {Type} from "parasprite"
import Project from "model/Project" // Whatever model you need

const TProject = Type("TProject")
  .field("name", TString, "Project name")
  .field("tagline", TString)

const schema = Schema()
  .query("Query")
    .resolve(
      "project", TProject, "Get the project by his name",
      Project.getProjectByName
    )
      .arg("name", TString)
    .end()
  .end()
.end()
```

Equivalent to:

```graphql
type TProject {
  # Project name
  name: String
  tagline: String
}

type Query {
  # Get the project by his name
  project(name: String): TProject
}

schema {
  query: Query
}
```

## API

Parasprite has classes that help you describe GraphQL schema with chains.

**Note: You can invoke these classes without "new" keyword, just like a function**

### constructor Schema()

Main class that defines GraphQL schema.

Available methods:

#### query(name[, description]) -> Type

  - string **name** – Name for root Query type
  - string **description** – Description for root Query type

Define Query with given name and description.

#### mutation(name[, description]) -> Type

  - string **name** – Name for root Mutation type
  - string **description** – Description for root Mutation type

Define Mutation with given name and description.

### subscription(name[, description]) -> Type

  - string **name** – Name for root Subscription type
  - string **description** – Description for root Subscription type

Define Subscription with given name and description.

#### end() -> GraphQLSchema

Make GraphQLSchema.

### constructor Type(name[, description, interfaces, isTypeOf])

  - string **name** – Name for object type
  - string **description** – Description for object type
  - GrphQLInterfaceType | GrphQLInterfaceType[] **interfaces**
  - function **isTypeOf**

This class helps you describe GraphQLObjectType.

Available methods:

#### field(name, type[, description, deprecationReason, required]) -> Type

  - string | object **name**
  - string | any[] **type**
  - string **description**
  - string **deprecationReason**
  - boolean **required** – If set to `true`, the field type will be marked as non-null.

Define one field on `GraphQLObjectType`.

Returns current instance of Type class.

#### resolve(name, type[, description, deprecationReason, required], handler) -> Resolve

  - string | object **name**
  - string | any[] **type**
  - string **description**
  - string **deprecationReason**
  - boolean **required** – If set to `true`, the field type will be marked as non-null.
  - function **handler** – a function that will be used as resover for this field

Define resolver on current `GraphQLObjectType`

#### end() -> GraphQLObjectType

Make `GraphQLObjectType`.

### constructor Input(name[, description])

  - string **name** – Name for object type
  - string **description** – Description for object type

#### field(name, type[, description, required, defaultValue]) -> Input

  - string | object **name**
  - string | any[] **type**
  - string **description**
  - boolean **required** – If set to `true`, the field type will be marked as non-null.
  - any **defaultValue** – default value for this field

### constructor Interface(name[, description], resolveType)

Create custim GraphQLInterfaceType using Parasprite chainable API

See [Type](https://github.com/octet-stream/parasprite#constructor-typename-description-interfaces-istypeof) section for more info about available methods.

## Utils

### parasprite.checkTypedList(list, predicate) -> boolean

Check if given list contains only a valid type.

### parasprite.isInterfaceType(value) -> boolean

Check if given type is an GraphQLList.

### parasprite.toListType(value) -> GraphQLList

Create GraphQLList from given array or value

### parasprite.toRequired(value) -> GraphQLNonNull

Mark given value as non-null.

## Roadmap:

  - [x] ~~Basic API with queries, mutations and object type~~;
  - [x] ~~Input types~~;
  - [x] ~~Test~~;
  - [x] ~~Interfaces~~ (documentation in progress);
  - [ ] Fragments;
  - [ ] Documentation (still in progress);
  - [ ] Complex working examples (as external repo)

## Misc

Wanted to learn more about GraphQL or try another tools?
Then visit [awesome-graphql](https://github.com/chentsulin/awesome-graphql) list! :)
