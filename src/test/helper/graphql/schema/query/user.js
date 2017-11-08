import TUser from "../../type/user/TUser"

// Implementing a regular GraphQL Resolver here
const resolve = {
  type: TUser,
  required: true,
  handler: () => ({
    login: "OctetStream"
  })
}

export {resolve}
