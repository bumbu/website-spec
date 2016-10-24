# Website spec usage with Internjs

First check what [InternJS](https://theintern.github.io) is.
Examples in this repo use [BDD interface](https://theintern.github.io/intern/#interface-tdd) but you could use any of them.

## Usage

```js
// Get the DSL compiler
var dsl = require('website-spec').frameworks.intern
// Get the raw contents of a file
var rawSpec = require('intern/dojo/text!tests/some_spec_file.spec')
var rawSpec2 = require('intern/dojo/text!tests/some_spec_file_2.spec')

...

bdd.describe('Suite name', function () {
  bdd.it('Test name', function() {
    return dsl.compile({remote: this.remote, spec: rawSpec})
  })

  bdd.it('Other test name', function() {
    var variables = {url: 'http://bumbu.me'}

    // An object where key is custom instruction name
    // and value is a function that gets executed
    var customInstructions = {
      'Class should not contain "disabled"': function(promise, variables) {
        promise = promise
          .getProperty('classList')
          .then(function(classList) {
            assert(classList.indexOf('disabled') == -1, 'Shouldn\'t be disabled');2
          })

        return promise
      }
    }

    return dsl.compile({
      remote: this.remote,
      spec: rawSpec2,
      variables: variables,
      customInstructions: customInstructions,
    });
  })
}
```

## Suported instructions

One instruction per line.
Indentation matters. Instructions that come after `Within`, `Select`, `Select visible` and `Click on` can be indented.

### Comments

Any line that starts with `#` is considered to be a comment

```
# Comment text
```

### Open

Open a web page. Supports variables and string

```
Open $url
Open `http://bumbu.me`
```
### Click

Makes a click. Should be indented.

```
Select `.element`
  # Will click on selected element
  Click
```

### Click at

Clicks at a given point (x, y).
The point is calculated relatively to the currently selected element

```
Select `.element`
  # Clicks at 10px to the right, 20px to the bottom from the top left corner of the selected element
  Click at {10, 20}
```

### Click on

`Click on` instruction accepts an optional element type and an element selector. Element selector can be:

* variable $myvar
* string `.my-element`
* identifier `create`

Variables are resolved into strings.
Identifiers are transformed into `[data-test=identifier]` where identifier is replaced by the passed identifier. That's the only convention.


Currently following elements are supported:

* button
* element
* link
* input
* textarea

For the elements that are not supported, you can add the element manually to the selector
```
`table.one`
```

Examples

```
# Clicks on element $('[data-test=create]')
Click on create

# Click on element $('button[data-test=create]')
Click on button create


# Click on element $('.my-awesome-selector')
Click on `.my-awesome-selector`

# Click on element $('button.my-selector')
Click on button `.my-selector`

# Click on element $('.element') if $SomeVariable = ".element"
Click on $SomeVariable

# Click on element $('a.element') if $SomeVariable = ".element"
Click on link $SomeVariable
```

### Selectors

`Within` and `Select` are the same. They're transformed into `.findByCssSelector`. `Select visible` is transformed into `findDisplayedByCssSelector`.

You may want to use `Select visible` when you need the element to be visible (most often for clicks).

Selectors support the same arguments as `Click on`

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

Stores an element property in a variable (for later use).
Currently following properties are supported:

* text
* class
* value

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

Waits for a given amount of time until proceeding to the next instruction.
Currently supports only seconds.

```
Sleep for 5 seconds
```

### Custom instructions

As the DSL doesn't try to cover all available and possible features (nor it could do that) - it allows for custom instructions.
Custom instructions are basically unique phrases that should be backed up by some test code (similar to how [Cucumber testing](https://github.com/cucumber/cucumber-js/blob/master/docs/nodejs_example.md) works.

Any line that starts with `!` is considered to be a custom instruction. That custom instruction should be available in the object of custom instructions that is passed into the compile method. Custom instructions can be used to create reusable sets of instructions (see examples).

```
!Do something nasty
````


## An example of a larger highlighted test

![image](https://cloud.githubusercontent.com/assets/171178/19619963/96ec9920-986a-11e6-9d5a-669c3b7d241d.png)
