# class Enum

Defines GraphQLUniomType.

## Usage

Each `.value()` method call takes at least two argumenst: `name` and `value` of the field.
Let's take a look at an example:

```js
import Enum from "parasprite/Enum"

const TDays = Enum("Days")
  .value("MONDAY", "monday")
  .value("TUESDAY", "tuesday")
  .value("WEDNESDAY", "wednesday")
  .value("THURSDAY", "thursday")
  .value("FRIDAY", "friday")
  .value("SATURDAY", "saturday")
  .value("SUNDAY", "sunday")
.end()
```

## API

### `constructor(name[, description]) -> {Enum}`

- **{string}** name – name of `enum` type
- **{string}** description – `enum` type description

### Instance methods

#### `end() -> {GraphQLEnumType}`

Creates a `GraphQLEnumType` using previously added values from Enum.

