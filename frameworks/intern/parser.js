const assert = require('assert')
const nearley = require('nearley')
const grammar = require('./../../build/grammar')

module.exports = {compile}

const defaults = {
  remote: null,
  spec: '',
  variables: {},
  customInstructions: {},
  debug: false,
  indentationStep: 2,
}

/**
 * Compiles the DSL into test instructions
 * @param  {{remote, spec}} clientOptions
 * @return {Promise}
 */
function compile(clientOptions) {
  if (!clientOptions.hasOwnProperty('remote')) throw new Error('Options should contain `remote`');
  if (!clientOptions.hasOwnProperty('spec')) throw new Error('Options should contain `spec`');

  const opts = Object.assign({}, defaults, clientOptions);
  const lines = opts.spec.split("\n");
  let currentIndentation = 0;
  let lineNumber = 0;

  // Setup
  let promise = opts.remote
    .setFindTimeout(3000)

  for (var line of lines) {
    lineNumber++;
    let lineData = processLine(line);

    if (lineData) {
      var {data, indentation} = lineData;

      // Check if it is a valid indentation
      if (!checkIndentation(currentIndentation, indentation, data[0])) {
        throw new Error(`Bad indentation at line ${lineNumber}: ${line}`)
      }

      // Check for indentation decrease
      while (indentation < currentIndentation) {
        promise = promise.end()
        if (opts.debug) console.log(`${spaces(currentIndentation)}.end()`)
        currentIndentation -= opts.indentationStep
      }

      switch (data[0]) {
        case 'Open':
          promise = promise.get(getValue(data[1], opts.variables))
          if (opts.debug) console.log(`${spaces(currentIndentation)}.get(${getValue(data[1], opts.variables)})`)
          break;

        case 'Click':
          promise = promise.click()
          if (opts.debug) console.log(`${spaces(currentIndentation)}.click()`)
          break;

        case 'Click on':
          promise = promise.findDisplayedByCssSelector(getSelector(data[1], opts.variables))
          if (opts.debug) console.log(`${spaces(currentIndentation)}.findDisplayedByCssSelector(${getSelector(data[1], opts.variables)})`)
          promise = promise.click()
          if (opts.debug) console.log(`${spaces(currentIndentation + opts.indentationStep)}.click()`)
          break;

        case 'Click at':
          promise = promise.moveMouseTo(data[1].value.x, data[1].value.y)
          if (opts.debug) console.log(`${spaces(currentIndentation)}.moveMouseTo(${data[1].value.x}, ${data[1].value.y})`)
          promise = promise.clickMouseButton(0)
          if (opts.debug) console.log(`${spaces(currentIndentation)}.clickMouseButton(0)`)
          promise = promise.releaseMouseButton(0)
          if (opts.debug) console.log(`${spaces(currentIndentation)}.releaseMouseButton(0)`)
          break;

        case 'Select':
        case 'Select visible':
          var fn = data[0] == 'Select' ? 'findByCssSelector' : 'findDisplayedByCssSelector';
          promise = promise[fn](getSelector(data[1], opts.variables))
          if (opts.debug) console.log(`${spaces(currentIndentation)}.${fn}(${getSelector(data[1], opts.variables)})`)
          break;

        case 'Sleep':
          promise = promise.sleep(data[1].value * 1000)
          if (opts.debug) console.log(`${spaces(currentIndentation)}.sleep(${data[1].value * 1000})`)
          break;

        case 'Type':
          var value = getValue(data[1], opts.variables)
          promise = promise.type(value)
          if (opts.debug) console.log(`${spaces(currentIndentation)}.type(${value})`)
          break;

        case 'Property':
          promise = injectPropertyIntoChain(data[1], promise, opts)
          promise = compareWithChainValue(data[2], data[3], promise, opts)
          break;

        case 'Remember':
          promise = injectPropertyIntoChain(data[1], promise, opts)
          promise = saveChainValue(data[2], promise, opts)
          break;

        case 'Custom':
          if (!opts.customInstructions.hasOwnProperty(data[1])) {
            throw new Error(`No custom instruction found: ${data[1]}`)
          }

          promise = opts.customInstructions[data[1]](promise, opts.variables)
      }

      // If current command expects an indent, increase current indentation
      // If next command will be at the same indent, it will add an .end() to close previous selector
      if (commandCanIndent(data[0])) {
        currentIndentation = indentation + opts.indentationStep
      } else {
        currentIndentation = indentation
      }

    }
  }

  return promise
}

function spaces(amount) {
  return ' '.repeat(amount)
}

/**
 * Get variable values
 * Throws an error if variable not set
 * @param  {String} name      Variable name
 * @param  {Object} variables All available variables
 * @return {Any}              Variable
 */
function getVariable(name, variables) {
  // Variable can be nested
  var path = name.split('.');
  var currentVars = variables;

  for (var i = 0; i < path.length; i++) {
    // TODO allow for arrays in variables
    if (!currentVars.hasOwnProperty(path[i])) {
      throw new Error(`Variable ${name} not found`)
    } else if (i < path.length - 1) {
      currentVars = currentVars[path[i]]
    } else if (i == path.length - 1) {
      return currentVars[path[i]]
    }
  }
}

/**
 * Set variable value
 * @param {String} name
 * @param {Any} value
 */
function setVariable(name, value, variables) {
  // Variable can be nested
  var path = name.split('.');
  var currentVars = variables;

  for (var i = 0; i < path.length; i++) {
    // TODO allow for arrays in variables
    if (i == path.length - 1) {
      currentVars[path[i]] = value;
    } else {
      // Create the object if not available
      if (!currentVars.hasOwnProperty(path[i])) {
        currentVars[path[i]] = {};
      }

      currentVars = currentVars[path[i]];
    }
  }
}


function getValue(obj, variables) {
  if (isString(obj)) {
    return obj;
  } else if (obj.type === 'string') {
    return obj.value;
  } else if (obj.type === 'variable') {
    return getVariable(obj.value, variables)
  }
}

function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * Compute selector
 * @param  {Object} data
 * @param  {Object} variables
 * @return {String}
 */
function getSelector(data, variables) {
  var elementType = getElementType(data.elementType)
  var selector;

  if (data.type === 'simpleSelector') {
    selector = `[data-test="${data.value}"]`
  } else if (data.type === 'selector') {
    selector = getValue(data.value);
  } else {
    throw new Error(`Unrecognized selector type: ${data.type}`)
  }

  return `${elementType}${selector}`
}

const typeMappings = {
  element: '',
  button: 'button',
  input: 'input',
  textarea: 'textarea',
  link: 'a',
}

function getElementType(type) {
  if (!type || !typeMappings.hasOwnProperty(type)) {
    return '';
  } else {
    return typeMappings[type];
  }
}

/**
 * Inserts a promise that will return a given property into the
 * promises chain
 * @param  {{type, value}} property Property Object
 * @param  {Promise} promise
 * @param  {Object} opts
 * @return {Promise}
 */
function injectPropertyIntoChain(property, promise, opts) {
  if (property.type !== 'property') {
    throw new Error('Bad property')
  }

  if (property.value === 'text' || property.value == 'value') {
    promise = promise.getVisibleText()
    if (opts.debug) console.log(`.getVisibleText()`)
  } else {
    promise = promise.getAttribute(property.value)
    if (opts.debug) console.log(`.getAttribute(${property.value})`)
  }

  return promise;
}

/**
 * Saves the promise chain value into a variable
 * @param  {{type, value}} obj
 * @param  {Promise} promise
 * @param  {{debug, variables}} opts   Options
 * @return {Promise}
 */
function saveChainValue(obj, promise, opts) {
  if (obj.type !== 'variable') {
    throw new Error('Can\'t update a non variable')
  }

  promise = promise.then(function(value) {
    setVariable(obj.value, value, opts.variables)
  })
  if (opts.debug) console.log(`.then(... set $${obj.value} value from chain)`)

  return promise
}

/**
 * Compares a value with chain value
 * @param  {{type: "condition", value}} condition
 * @param  {{type, value}} obj                      Value object
 * @param  {Promise} promise
 * @param  {{debug, variables}} opts                Options
 * @return {Promise}
 */
function compareWithChainValue(condition, obj, promise, opts) {
  if (condition.type !== 'condition') {
    throw new Error('Comparison should be done with a valid condition')
  }

  promise = promise.then(function(value) {
    var expectedValue = getValue(obj, opts.variables)

    if (condition.value === 'equal') {
      assert.equal(value, expectedValue)
    } else if (condition.value === '!equal') {
      assert.notEqual(value, expectedValue)
    } else {
      throw new Error(`Comparison ${condition.value} is not supported`)
    }
  })
  if (opts.debug) console.log(`.then(... expectation)`)

  return promise;
}

/**
 * Checks if indentation is valid
 * @param  {int} curr    current indentation
 * @param  {int} next    next indentation
 * @param  {String} command
 * @return {boolean}
 */
function checkIndentation(curr, next, command) {
  if (next <= curr) {
    return true
  } else if (next > curr + 1) {
    return false
  } else if (next == curr + 1) {
    return commandCanIndent(command)
  }
}

function commandCanIndent(command) {
  return ['Click on', 'Select', 'Select visible'].indexOf(command) !== -1;
}

function processLine(line) {
  var indentation = getIndentation(line);
  line = line.trim();
  // Skip empty lines
  if (!line) return;

  var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
  p.feed(line)

  var data = p.results[0][0].filter(e=>e)

  return {
    data: data,
    indentation: indentation,
  };
}

function getIndentation(line) {
  var indentation = 0;
  for (var i = 0; i < line.length; i++) {
    if (line[i] == ' ') {
      indentation++;
    } else {
      break;
    }
  }
  return indentation;
}
