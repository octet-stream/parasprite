import test from "ava"

import pq from "proxyquire"

const mock = stubs => pq("../../../parasprite", stubs).buildSchema

test("Foo", t => t.pass())
