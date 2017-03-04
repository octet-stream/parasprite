import http from "http"

import Koa from "koa"
import body from "koa-bodyparser"
import {graphqlKoa} from "graphql-server-koa"

function server(schema, options) {
  const koa = new Koa()

  const graphqlHandler = graphqlKoa(context => ({schema, context}))

  koa
    .use(body())
    .use(graphqlHandler)

  return http.createServer(koa.callback()).listen(options.port || 3310)
}

export default server
