import {isString} from "util"

import test from "ava"

import typeOf from "../../../../lib/util/internal/typeOf"

test("Should return a string with type name", t => {
  t.plan(2)

  const res = typeOf({})

  t.true(isString(res))
  t.is(res, "object")
})

test("Should return lowercased string for all basic types", t => {
  t.plan(8)

  const boolean = typeOf(false)
  const nullType = typeOf(null)
  const undefType = typeOf(undefined)
  const string = typeOf("string")
  const number = typeOf(451)
  const array = typeOf([])
  const func = typeOf(() => {})
  const object = typeOf({})

  t.is(boolean, "boolean")
  t.is(nullType, "null")
  t.is(undefType, "undefined")
  t.is(string, "string")
  t.is(number, "number")
  t.is(array, "array")
  t.is(func, "function")
  t.is(object, "object")
})

test("Should return as-is name for non-basic types", t => {
  t.plan(3)

  const genFn = typeOf(function* () { yield 0 })
  const map = typeOf(new Map())
  const set = typeOf(new Set())

  t.is(genFn, "GeneratorFunction")
  t.is(map, "Map")
  t.is(set, "Set")
})
