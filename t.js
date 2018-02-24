const t = {
  reporter: NodeJsReporter(DefaultFailureFormatter()),
  NodeJsReporter,
  DefaultFailureFormatter
}

function NodeJsReporter(failureFormatter) {
  return {
    passed,
    failed
  }

  function passed() {
    process.stdout.write(green('.'))
  }

  function failed(subj, desc, actual, predicate, expected) {
    console.error('')
    console.error(red(failureFormatter.format(subj, desc, actual, predicate, expected)))
  }

  function red(text) {
    return '\x1b[31m' + text + '\x1b[0m'
  }

  function green(text) {
    return '\x1b[32m' + text + '\x1b[0m'
  }
}

function DefaultFailureFormatter() {
  return {
    format
  }

  function format(subject, description, actual, predicate, expected) {
    return [
      `${subject}: ${description} FAILED`,
      'expected',
      indent(prettify(actual)),
      predicateName(predicate),
      ...(expected === undefined ? [] : [indent(prettify(expected))])
    ].join('\n')
  }

  function indent(string) {
    return string
      .split('\n')
      .map(line => '  ' + line)
      .join('\n')
  }

  function prettify(value) {
    if (value) {
      return JSON.stringify(value, null, 2)
    } else {
      return '' + value
    }
  }
}

function expect(actual, predicate, expected) {
  if (predicate(actual, expected)) {
    t.reporter.passed()
  } else {
    t.reporter.failed(t.subj, t.desc, actual, predicate, expected)
  }
}

function eq(a, b) {
  eq.displayName = 'to equal'

  if (a instanceof Array) {
    if (!(b instanceof Array)) {
      return false
    }

    if (a.length !== b.length) {
      return false
    }

    return a.every((elem, i) => eq(elem, b[i]))
  }

  if (a instanceof Object) {
    let aKeys = Object.keys(a)

    if (aKeys.length !== Object.keys(b).length) {
      return false
    }

    return aKeys.every(key => eq(a[key], b[key]))
  }

  return a === b
}

function not(predicate) {
  let negated = function(...args) {
    return !predicate(...args)
  }
  negated.displayName = 'not ' + predicateName(predicate)
  return negated
}

function defined(actual) {
  defined.displayName = 'to be defined'
  return actual !== undefined
}

function predicateName(predicate) {
  return predicate.displayName
    ? predicate.displayName
    : predicate.name
}

if (typeof module === 'object') {
  module.exports = {t, expect, eq, not, defined}
}
