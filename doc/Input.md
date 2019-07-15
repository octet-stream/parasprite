# class Input

Defines GraphQLInputObjectType

# Usage

```js
import {GraphQLEmail as TEmail} from "graphql-custom-types"
import {GraphQLString as TString} from "graphql"

import Input from "parasprite/Input"

const TAuthSignUp = Input("AuthSignUp")
  .field({
    name: "email",
    type: TEmail,
    required: true
  })
  .field({
    name: "login",
    type: TString,
    required: true
  })
  .field({
    name: "password",
    type: TString,
    required: true
  })
.end()

export default TAuthSignUp
```

## API

#### `constructor(name[, description]) -> {Input}`

- **{string}** name – input type name
- **{string}** [description = undefined] – input type description

#### `constructor(options) -> {Input}`

- **{string}** options.name – input type name
- **{string}** [options.description = undefined] – input type description

### Instance methods

#### `field(options) -> {Input}`

Appends a field on **GraphQLObjectInputType**. Returns current instance of **Input** class.

- **{object}** options – A field declaration options with the following properties:
  + **{string}** name
  + **{string | [object, boolean]}** type – Any valid GraphQL type, or a tuple with the type and **required** flag
  + **{string}** [description = undefined]
  + **{string}** [deprecationReason = undefined]
  + **{boolean}** [required = false] – If set to `true`, the field type will be marked as non-null.

#### `end() -> {GraphQLInputObjectType}`
