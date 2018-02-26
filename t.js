const t = {
  reporter: NodeJsReporter(DefaultFailureFormatter()),
  NodeJsReporter,
  DefaultFailureFormatter
}

function NodeJsReporter(failureFormatter, log=console.log) {
  let numPassed = 0
  let numFailed = 0

  return {
    passed,
    failed,
    finished
  }

  function passed() {
    numPassed++
  }

  function failed(subj, desc, actual, predicate, expected) {
    numFailed++
    log(red('----------------------------------------'))
    log(red(failureFormatter.format(subj, desc, actual, predicate, expected)))
  }

  function finished() {
    if (numFailed === 0) {
      log(successMessage())
    } else {
      log(red('\n========================================'))
      log(failureMessage())
      return 'SUITE_FAILED'
    }
  }

  function successMessage() {
    switch (numPassed) {
      case 0:
        return 'No tests found'
      case 1:
        return green('One test passed')
      default:
        return green('All ' + numPassed + ' tests passed')
    }
  }

  function failureMessage() {
    return numFailed === 1 ?
      red('One test failed') :
      red('' + numFailed + ' tests failed')
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
    t.suiteFailed = true
  }
  if (!t.suiteEndTimeout) {
    t.suiteEndTimeout = setTimeout(function() {
      if (t.reporter.finished() === 'SUITE_FAILED') {
        process.exit(1)
      }
    }, 1)
  }
}

function eq(a, b) {
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
eq.displayName = 'to equal'

function not(predicate) {
  let negated = function(...args) {
    result = !predicate(...args)
    return result
  }
  negated.displayName = 'not ' + predicateName(predicate)
  return negated
}

function defined(actual) {
  return actual !== undefined
}
defined.displayName = 'to be defined'

function predicateName(predicate) {
  return predicate.displayName
    ? predicate.displayName
    : predicate.name
}

if (typeof module === 'object') {
  module.exports = {t, expect, eq, not, defined}
}
