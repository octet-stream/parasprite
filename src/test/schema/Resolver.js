import test from "ava"

import isFunction from "helper/util/isFunction"

import Resolver from "lib/Resolver"

test("Should be a function", t => {
  t.plan(1)

  t.true(isFunction(Resolver))
})

test("Should throw an Error if resolver already exists", t => {
  t.plan(1)

  const trap = () => Resolver().resolve(() => {}).resolve(() => {})

  t.throws(
    trap,
    "Resolve handler already exists. " +
    "Add this resolver to current object type " +
    "before describe the new one."
  )
})

test("Should throw a TypeError when given handler is not a function", t => {
  t.plan(1)

  const trap = () => Resolver().resolve("You shall not pass!")

  t.throws(trap, "Resolve handler should be a function.")
})
