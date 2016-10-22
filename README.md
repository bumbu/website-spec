# Website spec

A domain specific language (DSL) for functional/E2E web testing.

![Spec DSL language example](https://cloud.githubusercontent.com/assets/171178/19620076/9c71915a-986c-11e6-9966-806d41bde82e.png)

## Supported frameworks

As the DSL is compiled into an intermediary representation, that representations has to be transformed into actual test code.

You can write your own compiler for your preferate test framework, or use one of those that are bundled in:

* [Intern.js](https://github.com/bumbu/website-spec/tree/master/frameworks/intern)

If you're interested only in the grammar, then you can check [grammar.test.js](https://github.com/bumbu/website-spec/blob/master/tests/grammar.test.js) file for examples.

Parsing is done by:

```js
const nearley = require('nearley')
const grammar = require('website-spec').grammar

const p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
p.feed('Click on button `.red`') // Pass only single-line text

console.log(p.results) // parsed tree
```

## Syntax highlighting in IDE

Following IDEs syntax highlightings are available:

* [SublimeText 3](https://github.com/bumbu/website-spec/blob/master/editors/Spec.sublime-syntax) - you'll have to install it manually into editor packages' `User` folder (`Preferences -> Browse Packages` opens the packages folder).

## Build and test

* Install deps `npm install`
* Build `npm run build` - that will build ant test the grammar

If you want to build or test only then check `package.json` file for those instructions separately.

## Modify the language

The language tries to be fairly simple. Unsuported functionality is expected to be covered with custom instructions (see custom instructions below).

Grammar is written, generated and parsed using [nearley](https://github.com/Hardmath123/nearley).

## Syntax

The DSL supports one instruction per line.
Grammar parser expects non-indented lines. So indentation has to be handled in each framework compiler separately.
Grammar parser generates a simple flat syntax tree.

Check [grammar tests](https://github.com/bumbu/website-spec/blob/master/tests/grammar.test.js) for examples of supported commands and generated trees.

For supported instructions see [Intern example](https://github.com/bumbu/website-spec/tree/master/frameworks/intern)
