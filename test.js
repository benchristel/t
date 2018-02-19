const {t, expect, eq, not} = require('./t')

t.subj = 'a test'
{
  t.desc = 'passes'
  expect(1, eq, 1)
}

t.subj = 'eq'
{
  t.desc = 'empty arrays are equal'
  expect([], eq, [])

  t.desc = 'array != object'
  expect([], not(eq), {})

  t.desc = 'deep comparison of arrays'
  expect([1, [2]], eq, [1, [2]])
  expect([1, 2], not(eq), [1, [2]])
  expect([1, [2, 3]], not(eq), [1, [2]])
  expect([1, [2]], not(eq), [1, [2, 3]])

  t.desc = 'deep comparison of objects'
  expect({a: 1}, eq, {a: 1})
  expect({a: 2}, not(eq), {a: 1})
  expect({a: {b: 1}}, not(eq), {a: {b: 1, c: 2}})
  expect({a: {b: 1, c: 2}}, not(eq), {a: {b: 1}})
}

t.subj = 'DefaultFailureFormatter'
{
  let formatter = t.DefaultFailureFormatter()

  t.desc = 'outputs actual, expected, and predicate'
  expect(
    formatter.format('subject', 'description', 1, eq, 2),
    eq,
`subject: description FAILED
expected
  1
to equal
  2`)

  expect(
    formatter.format('subject 2', 'description 2', 3, not(eq), 4),
    eq,
`subject 2: description 2 FAILED
expected
  3
not to equal
  4`)

  t.desc = 'pretty-prints JSONable objects'
  expect(
    formatter.format('s', 'd', {a: 1, b: 2}, eq, [1, 2, 3]),
    eq,
`s: d FAILED
expected
  {
    "a": 1,
    "b": 2
  }
to equal
  [
    1,
    2,
    3
  ]`
  )
}
