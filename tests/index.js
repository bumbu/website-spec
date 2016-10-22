const testResults = require('./grammar.test.js')()

if (testResults.failed === 0) {
  console.log('tests ok')
} else {
  throw new Error('failed test, stopping here')
}
