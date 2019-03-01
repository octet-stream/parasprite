import path from "path"
import fs from "fs"

const root = path.resolve(__dirname, "../../../")
const {main} = JSON.parse(
  fs.readFileSync(path.join(root, "package.json"), "utf-8")
)

// A very specific and ugly hack
function findParentModule(mod) {
  while (path.dirname(mod.filename) !== root) {
    mod = mod.parent
  }

  if (mod.parent.filename === path.resolve(root, main)) {
    return mod.parent.parent.filename
  }

  return mod.parent.filename
}

export default findParentModule
