import {resolve, dirname} from "path"

// eslint-disable-next-line import/no-unresolved
import {main} from "../../../package.json"

const root = resolve(__dirname, "../../../")

// A very specific and ugly hack
function findParentModule(mod) {
  while (dirname(mod.filename) !== root) {
    mod = mod.parent
  }

  if (mod.parent.filename === resolve(root, main)) {
    return mod.parent.parent.filename
  }

  return mod.parent.filename
}

export default findParentModule
