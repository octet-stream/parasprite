# parasprite

Describe your GraphQL schema using chainable interface

[![dependencies Status](https://david-dm.org/octet-stream/parasprite/status.svg)](https://david-dm.org/octet-stream/parasprite)
[![devDependencies Status](https://david-dm.org/octet-stream/parasprite/dev-status.svg)](https://david-dm.org/octet-stream/parasprite?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/parasprite.svg?branch=master)](https://travis-ci.org/octet-stream/parasprite)
[![Code Coverage](https://codecov.io/github/octet-stream/parasprite/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/parasprite?branch=master)

**Important note: Next version (0.2.0) will introduce significant changes for Schema, Type and Resolver classes API.**

## Requirements

* Node.js >= 6

* GraphQL.js 0.9.x (see [installation section](https://github.com/octet-stream/parasprite#installation))

## Installation

You can install parasprite from NPM:

```sh
npm install --save parasprite graphql@0.9.x
```

or YARN:

```
yarn add parasprite graphql@0.9.x
```

## Usage

**Note: All examples were written with ES modules syntax.**

Basically, all that you need to describe GraphQLSchema
is a Schema class and GraphQL internal types:

Take a look at simple example with a resolver that just greets a user:

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema from "parasprite"

const greeter = (_, {name}) => `Hello, ${name}!`

const schema = Schema()
  .query("Query")
    .resolve("greeter", TString, greeter, true)
      .arg("name", TString, true)
    .end()
  .end()
.end()
```

This schema is equivalent to the following code on GraphQL schema language:

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
      "project", TProject, Project.getProjectByName,
      "Get the project by his name"
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

Define Query with given name and description.

#### mutation(name[, description]) -> Type

Define Mutation with given name and description.

#### end() -> GraphQLSchema

Make GraphQLSchema.

### constructor Type(name[, description])

This class helps you describe GraphQLObjectType.

Available methods:

#### field(name, type[, description, deprecationReason, required]) -> Type

Define one field on `GraphQLObjectType`.

Returns current instance of Type class.

#### resolve(name, type[, description, deprecationReason, required], handler) -> Resolve

Define resolver on current `GraphQLObjectType`

#### end() -> GraphQLObjectType

Make `GraphQLObjectType`.

### constructor Input(name[, description])

#### field(name, type[, description, required, defaultValue]) -> Input

## Roadmap:

  - [x] ~~Basic API with queries, mutations and object type~~;
  - [x] ~~Input types~~;
  - [x] ~~Test~~;
  - [ ] Interfaces (in progress);
  - [ ] Fragments;
  - [ ] Documentation (still in progress);
  - [ ] Complex working examples (as external repo)
