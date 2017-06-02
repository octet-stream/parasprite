import fs from "fs"

import {graphql, introspectionQuery as query} from "graphql"

import promisify from "./promisify"

const writeFile = promisify(fs.writeFile)

const isNumber = val => typeof val === "number"

const stringify = (obj, indent) => JSON.stringify(obj, null, indent)

const toJSON = (obj, ind = 2) => stringify(obj, isNumber(ind) ? ind : "tab")

const getIntrospectedSchema = async schema => await graphql(schema, query)

const asObject = async schema => await getIntrospectedSchema(schema)

const asJSON = async (schema, indent) => toJSON(
  await getIntrospectedSchema(schema), indent
)

/**
 * Introspect and save GraphQL schema to file
 *
 * @param graphql.GraphQLSchema – schema to introspect
 * @param string path – path where schema will be saved
 * @param object options
 */
async function introspect(schema, path, options = {}) {
  const introspectedSchema = await getIntrospectedSchema(schema)

  const content = toJSON(introspectedSchema, options.spaces)

  delete options.spaces

  await writeFile(`${path}.json`, content, options)
}

introspect.asObject = asObject
introspect.asJSON = asJSON
export {asObject, asJSON}
export default introspect
