/**
 * Fixes nearley build to add support for AMD
 */

const fs = require('fs')
const toReplace = `if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}`

const replaceWith = `
// AMD
if (typeof define === 'function' && define.amd) {
  define('grammar', [], function () {
    return grammar;
    // return function(){return grammar};
  });
// CMD
} else if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
// Browser
} else {
   window.grammar = grammar;
}`

let contents = fs.readFileSync('./build/grammar.js', 'utf8')
contents = contents.replace(toReplace, replaceWith)

fs.writeFileSync('./build/grammar.js', contents)
