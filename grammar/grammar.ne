# Open it with Markdown syntax highlighting
@builtin "whitespace.ne"
@builtin "string.ne"
@builtin "number.ne"

# Entry point
#############
line ->
    openCommand
  | clickCommand
  | commentCommand
  | selectCommand
  | rememberCommand
  | propertyCommand
  | typeCommand
  | sleepCommand
  | customCommand


# Commands
##########

# Open command
openCommand ->
  "Open" __ value           {% function (d) {return [d[0], d[2][0]]} %}

# Click command
clickCommand ->
    "Click"
  | "Click on" __ selector  {% function (d) {return [d[0], d[2]]} %}
  | "Click at" __ point

# Comment command
commentCommand -> "#" .:*   {% function(d) {return ["Comment", d[1].join('').trim()]} %}

# Select command
selectCommand ->
    "Within" __ selector    {% function(d) {return ["Select", d[2]]} %}
  | "Select" __ selector
  | "Select visible" __ selector

# Remember command
rememberCommand ->
  "Remember" __ property __ "as" __ variable {% function(d) {return [d[0], d[2], d[6]]} %}

# Property command
propertyCommand ->
  "Property" __ property __ condition __ value {% function(d) {return [d[0], d[2], d[4], d[6][0]]} %}

# Type command
typeCommand ->
  "Type" __ value           {% function(d) {return [d[0], d[2][0]]} %}

# Sleep command
sleepCommand ->
  "Sleep for" __ int __ ("second" | "seconds")  {% function(d) {return ["Sleep", {type: 'timeDelay', unit: 'second', value: d[2]}]} %}

# Custom command
customCommand -> "!" .:*   {% function(d) {return ["Custom", d[1].join('').trim()]} %}

# Utils
#######

# Any word
anyWord -> [^\s]:+ {% function(d) {return d[0].join(""); } %}

# No quotes string
nqString -> [^\s\"\'\`\$]:+ {% function(d) {return d[0].join(""); } %}

# Element type
elementType ->
    "button"
  | "element"
  | "link"
  | "input"
  | "textarea"

# Selector
selector ->
    nqString                {% function (d) {return {type: 'simpleSelector', value: d[0]}} %}
  | elementType __ nqString {% function (d) {return {type: 'simpleSelector', elementType: d[0][0], value: d[2]}} %}
  | btstring                {% function (d) {return {type: 'selector', value: d[0]}} %}
  | elementType __ btstring {% function (d) {return {type: 'selector', elementType: d[0][0], value: d[2]}} %}
  | variable                {% function (d) {return {type: 'selector', value: d[0]}} %}
  | elementType __ variable {% function (d) {return {type: 'selector', elementType: d[0][0], value: d[2]}} %}

# Property
property ->
    propertyType            {% function(d) {return {type: 'property', value: d[0][0]}} %}

propertyType ->
    "text"
  | "class"
  | "value"

# Value
# Can be a quoted string or a variable value
value ->
    variable
  | stringValue

# Condition
condition ->
    "should be"             {% function(d) {return {type: 'condition', value: 'equal'}} %}
  | "should not be"         {% function(d) {return {type: 'condition', value: '!equal'}} %}

# Point
point ->
  "{" int "," int "}" {% function (d) {return {type: 'point', value: {x: d[1], y: d[3]}}} %}

# Variable
variable -> "$" anyWord     {% function (d) {return {type: 'variable', value: d[1]}} %}

# String value
stringValue ->
    btstring                {% function(d) {return {type: 'string', value: d[0]}} %}
