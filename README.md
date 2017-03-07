# parasprite

Describe your GraphQL schema using chainable interface

[![dependencies Status](https://david-dm.org/octet-stream/parasprite/status.svg)](https://david-dm.org/octet-stream/parasprite)
[![devDependencies Status](https://david-dm.org/octet-stream/parasprite/dev-status.svg)](https://david-dm.org/octet-stream/parasprite?type=dev)
[![Build Status](https://travis-ci.org/octet-stream/parasprite.svg?branch=master)](https://travis-ci.org/octet-stream/parasprite)
[![Code Coverage](https://codecov.io/github/octet-stream/parasprite/coverage.svg?branch=master)](https://codecov.io/github/octet-stream/parasprite?branch=master)

## Installation

You can install parasprite from NPM:

```sh
npm install --save parasprite
```

or YARN:

```
yarn add parasprite
```

## Usage

Basically, all that you need to describe GraphQLSchema
is a Schema and Type classes:

**Note: All examples where written with ES modules syntax.**

```js
import {GraphQLString as TString} from "graphql" // You also need graphql package
import Schema, {Type} from "parasprite"
import Project from "model/Project" // Whatever model you need

const TProject = Type("TProject")
  .field("name", TString, "Project name")
  .field("tagline", TString)

const mySchema = Schema()
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

## API

Parasprite have classes that help you to describe GraphQL schema with chains.
Note: You can invoke these classes without "new" keyword, just like a function

### constructor Schema()

The main class that defines GraphQL schema.

Available methods:

#### query(name[, description]) -> Type

Define Query with given name and description.

#### mutation(name[, description]) -> Type

Define Mutation with given name and description.

#### end() -> GraphQLSchema

Make GraphQLSchema.

### constructor Type(name[, description])

This class helps you to describe GraphQLObjectType.

Available methods:

#### field(name, type[, required, description, deprecationReason]) -> Type

Define one field on GraphQLObjectType.
Use this method when you want to describe custom GraphQLObjectType.

Returns a current instance of Type class.

#### resolve(name, type, callee[, required, description, deprecationReason]) -> Type

Define resolver on current GraphQLObjectType

#### end() -> GraphQLObjectType

Make GraphQLObjectType.

## TODO:

  * ~~Implement mutations~~, subscriptions ~~and types~~;
  * Add docs and examples (as external repo?);
  * ~~Add tests~~.
