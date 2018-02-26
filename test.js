const {t, expect, eq, not, defined} = require('./t')

// =========================================================
t.subj = 'a test'
{
  t.desc = 'passes'
  expect(1, eq, 1)
}

// =========================================================
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

// =========================================================
t.subj = 'defined'
{
  t.desc = 'given undefined'
  expect(undefined, not(defined))
  t.desc = 'given a falsey value'
  expect(0, defined)
  t.desc = 'given a truthy value'
  expect(1, defined)
}

// =========================================================
t.subj = 'DefaultFailureFormatter'
{
  let formatter = t.DefaultFailureFormatter()

  t.desc = 'outputs actual, expected, and predicate'
  expect(
    formatter.format('subject', 'description', 1, eq, 2),
    eq, [
      'subject: description FAILED',
      'expected',
      '  1',
      'to equal',
      '  2'
    ].join('\n'))

  expect(
    formatter.format('subject 2', 'description 2', 3, not(eq), 3),
    eq, [
      'subject 2: description 2 FAILED',
      'expected',
      '  3',
      'not to equal',
      '  3'
    ].join('\n'))

  t.desc = 'pretty-prints JSONable objects'
  expect(
    formatter.format('subj', 'desc', {a: 1, b: 2}, eq, [1, 2, 3]),
    eq, [
      'subj: desc FAILED',
      'expected',
      '  {',
      '    "a": 1,',
      '    "b": 2',
      '  }',
      'to equal',
      '  [',
      '    1,',
      '    2,',
      '    3',
      '  ]'
    ].join('\n'))

  t.desc = 'undefined expected value'
  expect(
    formatter.format('subj', 'desc', 1, defined, undefined),
    eq, [
      'subj: desc FAILED',
      'expected',
      '  1',
      'to be defined'
    ].join('\n'))

  t.desc = 'undefined actual value'
  expect(
    formatter.format('subj', 'desc', undefined, defined, undefined),
    eq, [
      'subj: desc FAILED',
      'expected',
      '  undefined',
      'to be defined'
    ].join('\n'))

  t.desc = 'negated predicate'
  expect(
    formatter.format('subj', 'desc', 1, not(defined)),
    eq, [
      'subj: desc FAILED',
      'expected',
      '  1',
      'not to be defined'
    ].join('\n'))
}

// =========================================================
t.subj = 'NodeJsReporter'
{
  let nullFormatter = {format() {return 'fail'}}
  let log = function(...args) {
    log.calls.push(args)
  }
  log.calls = []
  let reporter

  t.desc = 'logs when no tests ran'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.finished()
  expect(log.calls, eq, [['No tests found']])
  log.calls.length = 0

  t.desc = 'logs a single passing test'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.passed()
  reporter.finished()
  expect(log.calls, eq, [['\u001b[32mOne test passed\u001b[0m']])
  log.calls.length = 0

  t.desc = 'logs 2 passing tests'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.passed()
  reporter.passed()
  reporter.finished()
  expect(log.calls, eq, [['\u001b[32mAll 2 tests passed\u001b[0m']])
  log.calls.length = 0

  t.desc = 'logs a failure'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.failed()
  reporter.finished()
  expect(log.calls, eq, [
    ['\u001b[31m----------------------------------------\u001b[0m'],
    ['\u001b[31mfail\u001b[0m'],
    ['\u001b[31m\n========================================\u001b[0m'],
    ['\u001b[31mOne test failed\u001b[0m'],
  ])
  log.calls.length = 0

  t.desc = 'logs 2 failures'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.failed()
  reporter.failed()
  reporter.finished()
  expect(log.calls, eq, [
    ['\u001b[31m----------------------------------------\u001b[0m'],
    ['\u001b[31mfail\u001b[0m'],
    ['\u001b[31m----------------------------------------\u001b[0m'],
    ['\u001b[31mfail\u001b[0m'],
    ['\u001b[31m\n========================================\u001b[0m'],
    ['\u001b[31m2 tests failed\u001b[0m'],
  ])
  log.calls.length = 0

  t.desc = 'logs failures when some tests passed'
  reporter = t.NodeJsReporter(nullFormatter, log)
  reporter.failed()
  reporter.failed()
  reporter.passed()
  reporter.finished()
  expect(log.calls, eq, [
    ['\u001b[31m----------------------------------------\u001b[0m'],
    ['\u001b[31mfail\u001b[0m'],
    ['\u001b[31m----------------------------------------\u001b[0m'],
    ['\u001b[31mfail\u001b[0m'],
    ['\u001b[31m\n========================================\u001b[0m'],
    ['\u001b[31m2 tests failed\u001b[0m'],
  ])
  log.calls.length = 0
}
