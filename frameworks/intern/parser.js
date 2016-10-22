const assert = require('assert')
const nearley = require('nearley')
const INDENTATION_STEP = 2
const P_DEBUG = false // Parser debug

module.exports = compile

/**
 * Compiles the DSL into test commands
 * @param  {Sting} fileContents         spec file contents
 * @param  {Object} self                `this` from the test
 * @param  {Object} variables           available variables
 * @param  {Object} customInstructions  An object of custom instructions
 * @return {Promise}
 */
function compile(fileContents, self, variables, customInstructions) {
  variables = variables || {}
  customInstructions = customInstructions || {}
  var lines = fileContents.split("\n");
  var promise;
  var currentIndentation = 0;
  var lineData;
  var lineNumber = 0;

  // Setup
  promise = self.remote
    .setFindTimeout(3000)

  for (var line of lines) {
    lineNumber++;
    lineData = processLine(line);
    if (lineData) {
      var {data, indentation} = lineData;

      // Check if it is a valid indentation
      if (!checkIndentation(currentIndentation, indentation, data[0])) {
        throw new Error(`Bad indentation at line ${lineNumber}: ${line}`)
      }

      // Check for indentation decrease
      while (indentation < currentIndentation) {
        promise = promise.end()
        if (P_DEBUG) console.log(`${spaces(currentIndentation)}.end()`)
        currentIndentation -= INDENTATION_STEP
      }

      switch (data[0]) {
        case 'Open':
          promise = promise.get(getValue(data[1], variables))
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.get(${getValue(data[1], variables)})`)
          break;

        case 'Click':
          promise = promise.click()
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.click()`)
          break;

        case 'Click on':
          promise = promise.findDisplayedByCssSelector(getSelector(data[1], variables))
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.findDisplayedByCssSelector(${getSelector(data[1], variables)})`)
          promise = promise.click()
          if (P_DEBUG) console.log(`${spaces(currentIndentation + INDENTATION_STEP)}.click()`)
          break;

        case 'Click at':
          promise = promise.moveMouseTo(data[1].value.x, data[1].value.y)
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.moveMouseTo(${data[1].value.x}, ${data[1].value.y})`)
          promise = promise.clickMouseButton(0)
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.clickMouseButton(0)`)
          promise = promise.releaseMouseButton(0)
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.releaseMouseButton(0)`)
          break;

        case 'Select':
        case 'Select visible':
          var fn = data[0] == 'Select' ? 'findByCssSelector' : 'findDisplayedByCssSelector';
          promise = promise[fn](getSelector(data[1], variables))
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.${fn}(${getSelector(data[1], variables)})`)
          break;

        case 'Sleep':
          promise = promise.sleep(data[1].value * 1000)
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.sleep(${data[1].value * 1000})`)
          break;

        case 'Type':
          var value = getValue(data[1], variables)
          promise = promise.type(value)
          if (P_DEBUG) console.log(`${spaces(currentIndentation)}.type(${value})`)
          break;

        case 'Property':
          promise = injectPropertyIntoChain(data[1], promise)
          promise = compareWithChainValue(data[2], data[3], variables, promise)
          break;

        case 'Remember':
          promise = injectPropertyIntoChain(data[1], promise)
          promise = saveChainValue(data[2], variables, promise)
          break;

        case 'Custom':
          if (!customInstructions.hasOwnProperty(data[1])) {
            throw new Error(`No custom instruction found: ${data[1]}`)
          }

          promise = customInstructions[data[1]](promise, variables)
      }

      // If current command expects an indent, increase current indentation
      // If next command will be at the same indent, it will add an .end() to close previous selector
      if (commandCanIndent(data[0])) {
        currentIndentation = indentation + INDENTATION_STEP
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
 * @return {Promise}
 */
function injectPropertyIntoChain(property, promise) {
  if (property.type !== 'property') {
    throw new Error('Bad property')
  }

  if (property.value === 'text' || property.value == 'value') {
    promise = promise.getVisibleText()
    if (P_DEBUG) console.log(`.getVisibleText()`)
  } else {
    promise = promise.getAttribute(property.value)
    if (P_DEBUG) console.log(`.getAttribute(${property.value})`)
  }

  return promise;
}

/**
 * Saves the promise chain value into a variable
 * @param  {{type, value}} obj
 * @param  {Object} variables   Current variables
 * @param  {Promise} promise
 * @return {Promise}
 */
function saveChainValue(obj, variables, promise) {
  if (obj.type !== 'variable') {
    throw new Error('Can\'t update a non variable')
  }

  promise = promise.then(function(value) {
    setVariable(obj.value, value, variables)
  })
  if (P_DEBUG) console.log(`.then(... set $${obj.value} value from chain)`)

  return promise
}

/**
 * Compares a value with chain value
 * @param  {{type: "condition", value}} condition
 * @param  {{type, value}} obj                      Value object
 * @param  {Object} variables                       Current variables
 * @param  {Promise} promise
 * @return {Promise}
 */
function compareWithChainValue(condition, obj, variables, promise) {
  if (condition.type !== 'condition') {
    throw new Error('Comparison should be done with a valid condition')
  }

  promise = promise.then(function(value) {
    var expectedValue = getValue(obj, variables)

    if (condition.value === 'equal') {
      assert.equal(value, expectedValue)
    } else if (condition.value === '!equal') {
      assert.notEqual(value, expectedValue)
    } else {
      throw new Error(`Comparison ${condition.value} is not supported`)
    }
  })
  if (P_DEBUG) console.log(`.then(... expectation)`)

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

  var grammar = require('./grammar')
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
