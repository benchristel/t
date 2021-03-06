# t

A very tiny test framework for JavaScript.

## Usage

```javascript
t.subj = 'first'
t.case = 'empty list'
expect(first(1, []), eq, [])
t.case = 'one item'
expect(first(1, [5]), eq, [5])
```

## API

- `t.subj`: Your tests should set this property to a description of the item under test. Printed in test results.
- `t.desc`: Your tests should set this property to a description of the test case. Printed in test results.
- `expect(actual, predicate, expected)`: Assert that the predicate function returns true when called like this: `predicate(actual, expected)`. If the predicate function has a property `displayName`, it will be printed in test failures. Otherwise, the `name` of the predicate will be printed.

Several predicates for use with `expect` are included. These are:

- `eq`: Deep-compares two objects or arrays. Compares primitive types with `===`.
- `not`: Inverts another predicate, e.g. `expect(1, not(eq), 2)`.
- `defined`: Tests that the value is not `undefined`, e.g. `expect([][0], not(defined))`.

It's very easy to create any other predicates you need for your tests. Any function that returns truthy/falsy based on some comparison will work. To customize the verb that's printed in test results, add a `displayName` property to the predicate function.

## Installation

Download `t.js` or copy-paste it into your code.
