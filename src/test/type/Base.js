import test from "ava"

import Base from "../../lib/type/Base"

test(
  "Should have overwritten \"inspect\", \"toString\" and \"valueOf\" methods",
  t => {
    t.plan(3)

    const base = new Base()

    t.is(base.inspect(), "ParaspriteBase", "Should return a valid string")
    t.is(base.toString(), "ParaspriteBase", "Should return a valid string")
    t.is(base.valueOf(), "ParaspriteBase", "Should return a valid string")
  }
)
