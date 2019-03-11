# class Enum

Defines GraphQLEnumType.

## Usage

Each `.field()` method call takes at least two argumenst: `name` and `value` of the field.
Let's take a look at an example:

```js
import Enum from "parasprite/Enum"

const TDays = Enum("Days")
  .field("MONDAY", "monday")
  .field("TUESDAY", "tuesday")
  .field("WEDNESDAY", "wednesday")
  .field("THURSDAY", "thursday")
  .field("FRIDAY", "friday")
  .field("SATURDAY", "saturday")
  .field("SUNDAY", "sunday")
.end()
```

## API

### `constructor(name[, description]) -> {Enum}`

- **{string}** name – name of `enum` type
- **{string}** description – `enum` type description

### Instance methods

#### `field(name[, value, description, deprecationReason]) -> {Enum}`

Appends a new field to Enum type.

- **{string}** name – name of `enum` field
- **{any}** [value = undefined] – value of `enum` field
- **{string}** [description = undefined] – description of `enum` field
- **{string}** [deprecationReason = undefined] – deprecation reason of `enum` fields.

#### `field(options) -> {Enum}`

- **{object}** options – `enum` field options
  + **{string}** name – name of `enum` field
  + **{any}** [value = undefined] – value of `enum` field
  + **{string}** [description = undefined] – description of `enum` field
  + **{string}** [deprecationReason = undefined] – deprecation reason of `enum` fields.

#### `end() -> {GraphQLEnumType}`

Creates a `GraphQLEnumType` using previously added values from Enum.

