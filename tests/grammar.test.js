module.exports = test;

var nearley = require('nearley')
var grammar = require('./../build/grammar')
var equal = require('deep-equal')


var tests = {
  // Open
  'Open `/some/url`': ["Open",{"type":"string","value":"/some/url"}],
  'Open $url': ["Open",{"type":"variable","value":"url"}],

  // Clicks
  'Click': ["Click"],
  'Click on create': ["Click on",{"type":"simpleSelector","value":"create"}],
  'Click on button create': ["Click on",{"type":"simpleSelector","elementType":"button","value":"create"}],
  'Click on `.my awesome selector`': ["Click on",{"type":"selector","value":".my awesome selector"}],
  'Click on button `.my awesome selector`': ["Click on",{"type":"selector","elementType":"button","value":".my awesome selector"}],
  'Click on $SomeVariable': ["Click on",{"type":"selector","value":{"type":"variable","value":"SomeVariable"}}],
  'Click on link $SomeVariable': ["Click on",{"type":"selector","elementType":"link","value":{"type":"variable","value":"SomeVariable"}}],
  'Click at {200,2}': ['Click at', {type: 'point', value: {x: 200, y: 2}}],

  // Selectors
  'Within card-panel-store': ["Select",{"type":"simpleSelector","value":"card-panel-store"}],
  'Within `.my selector`': ["Select",{"type":"selector","value":".my selector"}],
  'Select element `.preview-value`': ["Select",{"type":"selector","elementType":"element","value":".preview-value"}],
  'Select `.preview-value`': ["Select",{"type":"selector","value":".preview-value"}],
  'Select my-button': ["Select",{"type":"simpleSelector","value":"my-button"}],
  'Select link my-button': ["Select",{"type":"simpleSelector","elementType":"link","value":"my-button"}],
  'Select textarea $Variable': ["Select",{"type":"selector","elementType":"textarea","value":{"type":"variable","value":"Variable"}}],
  'Select $Variable': ["Select",{"type":"selector","value":{"type":"variable","value":"Variable"}}],
  'Select button $Variable': ["Select",{"type":"selector","elementType":"button","value":{"type":"variable","value":"Variable"}}],
  'Select visible my-card': ["Select visible",{"type":"simpleSelector","value":"my-card"}],
  'Select visible button my-card': ["Select visible",{"type":"simpleSelector","elementType":"button","value":"my-card"}],
  'Select visible `.my-card`': ["Select visible",{"type":"selector","value":".my-card"}],
  'Select visible link `.my-card`': ["Select visible",{"type":"selector","elementType":"link","value":".my-card"}],
  'Select visible $Variable': ["Select visible",{"type":"selector","value":{"type":"variable","value":"Variable"}}],
  'Select visible link $Variable': ["Select visible",{"type":"selector","elementType":"link","value":{"type":"variable","value":"Variable"}}],

  // Variable assignment
  'Remember text as $StoreName': ["Remember",{"type":"property","value":"text"},{"type":"variable","value":"StoreName"}],
  'Remember value as $StoreName': ["Remember",{"type":"property","value":"value"},{"type":"variable","value":"StoreName"}],

  // Properties check
  'Property text should be $StoreName': ["Property",{"type":"property","value":"text"},{"type":"condition","value":"equal"},{"type":"variable","value":"StoreName"}],
  'Property text should not be $StoreName': ["Property",{"type":"property","value":"text"},{"type":"condition","value":"!equal"},{"type":"variable","value":"StoreName"}],

  // Type
  'Type $Faker.lorem.words(3)': ["Type",{"type":"variable","value":"Faker.lorem.words(3)"}],
  'Type `some words`': ["Type",{"type":"string","value":"some words"}],

  // Sleep
  'Sleep for 5 seconds': ["Sleep",{"type":"timeDelay","unit":"second","value":5}],

  // Custom
  '!Do something nasty': ["Custom","Do something nasty"],
}

function test() {
  var successful = 0
  var failed = 0
  var p
  var results

  for (var key in tests) {
    p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
    p.feed(key)
    results = p.results[0][0].filter(e=>e)

    if (equal(results, tests[key])) {
      successful += 1
    } else {
      failed += 1
      console.log(`For\n${key}\nexpected\n${JSON.stringify(tests[key])}\nbut got\n${JSON.stringify(results)}`)
    }
  }

  console.log(`Successful: ${successful}, Failed: ${failed}`)

  return {
    successful: successful,
    failed: failed,
  }
}
