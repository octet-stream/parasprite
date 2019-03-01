import test from "ava"

import {
  GraphQLSchema, GraphQLObjectType,
  GraphQLString as TString,
  GraphQLInt as TInt,
  GraphQLID as TID
} from "graphql"

import {Schema, Type, Input} from "parasprite"

test("Should create a GraphQLSchema", t => {
  t.plan(1)

  const schema = Schema()
    .query("Query")
      .resolve({
        name: "hello",
        type: TString,
        required: true,
        noArgs: true,
        handler: () => "Hello, world!"
      })
    .end()
  .end()

  t.true(schema instanceof GraphQLSchema)
})

test("Should create schema from the existing Type", t => {
  t.plan(3)

  const TQuery = Type("Query")
    .resolve({
      name: "greet",
      type: TString,
      required: true,
      handler: (_, {name}) => `Hello, ${name}!`
    })
      .arg({
        name: "name",
        type: TString,
        required: true,
        default: "John Doe"
      })
    .end()
  .end()

  const schema = Schema().query(TQuery).end()

  t.true(schema instanceof GraphQLSchema)

  const query = schema.getQueryType()

  t.true(query instanceof GraphQLObjectType)
  t.deepEqual(query, TQuery)
})

test("Should add a mutation type to the schema", t => {
  t.plan(2)

  const users = [
    {
      name: "John Doe",
      age: 25,
      city: "Heerlen"
    }
  ]

  const TUser = Type("User")
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
    .field({
      name: "city",
      type: TString,
      required: true
    })
  .end()

  const TUserInput = Input("UserInput")
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
    .field({
      name: "city",
      type: TString,
      required: true
    })
  .end()

  const TQuery = Type("Query")
    .resolve({
      name: "user",
      type: TString,
      handler: (_, {name}) => users.find(val => val.name === name)
    })
      .arg({
        name: "name",
        type: TString,
        default: "John Doe"
      })
    .end()
  .end()

  const TMutation = Type("Mutation")
    .resolve({
      name: "addUser",
      type: TUser,
      required: true,
      handler(_, {user}) {
        users.push({
          ...user
        })

        return users
      }
    })
      .arg({
        name: "user",
        type: TUserInput,
        required: true
      })
    .end()
  .end()

  const schema = Schema().query(TQuery).mutation(TMutation).end()

  const mutation = schema.getMutationType()

  t.true(mutation instanceof GraphQLObjectType)
  t.deepEqual(mutation, TMutation)
})

test("Should add subscription field to the schema", t => {
  t.plan(2)

  const users = []

  const TQuery = Type("Query")
    .resolve({
      name: "user",
      type: TString,
      handler: (_, {name}) => users.find(val => val.name === name)
    })
      .arg({
        name: "name",
        type: TString,
        required: true,
      })
    .end()
  .end()

  const TSubscription = Type("Subscription")
    .subscribe({
      name: "userAdded",
      type: TID,
      required: true,
      handler() {}
    })
    .end()
  .end()

  const schema = Schema().query(TQuery).subscription(TSubscription).end()

  const subscription = schema.getSubscriptionType()

  t.true(subscription instanceof GraphQLObjectType)
  t.deepEqual(subscription, TSubscription)
})
