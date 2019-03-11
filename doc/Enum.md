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
