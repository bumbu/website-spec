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

### Open

Intended to open a page

```
Open $url
Open `http://bumbu.me
```
### Click 

Intended to make a click 

```
Click
Click on create
Click on button create
Click on `.my awesome selector`
Click on button `.my awesome selector`
Click on $SomeVariable
Click on link $SomeVariable
Click at {200,2}
```

### Selectors

```
Within card-panel-store
Within `.my selector`
Select element `.preview-value`
Select `.preview-value`
Select my-button
Select link my-button
Select textarea $Variable
Select $Variable
Select button $Variable
Select visible my-card
Select visible button my-card
Select visible `.my-card`
Select visible link `.my-card`
Select visible $Variable
Select visible link $Variable
```

### Remember

Stores an element property in a variable (for later use)

```
Remember text as $StoreName
Remember value as $StoreName
```

### Property check

Checkes that a property is/is not equal to a variable or string

```
Property text should be $StoreName
Property text should not be `My Name`
```

### Type

Types in a text input/textarea or a file input

```
Type $Faker.lorem.word
Type `some words`
Type `/root/usr/bumbu/files/mypic.jpg`
```

### Sleep

Waits for a given amount of time until proceeting next

```
Sleep for 5 seconds
```

### Custom instructions

As the DSL doesn't try to cover all available and possible features (nor it could do that) - it allows for custom instructions. 
Custom instructions are basically unique phrases that should be backed up by some test code (similar to how [Cucumber testing](https://github.com/cucumber/cucumber-js/blob/master/docs/nodejs_example.md) works.

```
!Do something nasty
````





