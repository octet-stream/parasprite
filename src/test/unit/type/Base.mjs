import test from "ava"

import Base from "lib/type/Base"

const hasSymbol = object => (
  Object.getOwnPropertySymbols(object).includes(Symbol.toStringTag)
)

test("Should have Symbol.toStringTag property", t => {
  t.plan(1)

  t.true(hasSymbol(Base.prototype))
})

test("Symbol.toStringTag should return a name of current constructor", t => {
  t.plan(1)

  t.is(new Base()[Symbol.toStringTag], "ParaspriteBase")
})

test(
  "Should have overwritten .toString() and .valueOf() methods",
  t => {
    t.plan(2)

    const base = new Base()

    t.is(base.toString(), "ParaspriteBase", "Should return a valid string")
    t.is(base.valueOf(), "ParaspriteBase", "Should return a valid string")
  }
)
