// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

function nth(n) {
    return function(d) {
        return d[n];
    };
}


function $(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        });
        return ret;
    };
}
var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["wschar", "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["wschar", "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "dqstring$ebnf$1", "symbols": []},
    {"name": "dqstring$ebnf$1", "symbols": ["dstrchar", "dqstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "dqstring", "symbols": [{"literal":"\""}, "dqstring$ebnf$1", {"literal":"\""}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "sqstring$ebnf$1", "symbols": []},
    {"name": "sqstring$ebnf$1", "symbols": ["sstrchar", "sqstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "sqstring", "symbols": [{"literal":"'"}, "sqstring$ebnf$1", {"literal":"'"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "btstring$ebnf$1", "symbols": []},
    {"name": "btstring$ebnf$1", "symbols": [/[^`]/, "btstring$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "btstring", "symbols": [{"literal":"`"}, "btstring$ebnf$1", {"literal":"`"}], "postprocess": function(d) {return d[1].join(""); }},
    {"name": "dstrchar", "symbols": [/[^\\"\n]/], "postprocess": id},
    {"name": "dstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "sstrchar", "symbols": [/[^\\'\n]/], "postprocess": id},
    {"name": "sstrchar", "symbols": [{"literal":"\\"}, "strescape"], "postprocess": 
        function(d) {
            return JSON.parse("\""+d.join("")+"\"");
        }
        },
    {"name": "strescape", "symbols": [/["'\\/bfnrt]/], "postprocess": id},
    {"name": "strescape", "symbols": [{"literal":"u"}, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/, /[a-fA-F0-9]/], "postprocess": 
        function(d) {
            return d.join("");
        }
        },
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/, "unsigned_int$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/, "int$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/, "unsigned_decimal$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/, "decimal$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/, "decimal$ebnf$3$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/, "jsonfloat$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "line", "symbols": ["openCommand"]},
    {"name": "line", "symbols": ["clickCommand"]},
    {"name": "line", "symbols": ["commentCommand"]},
    {"name": "line", "symbols": ["selectCommand"]},
    {"name": "line", "symbols": ["rememberCommand"]},
    {"name": "line", "symbols": ["propertyCommand"]},
    {"name": "line", "symbols": ["typeCommand"]},
    {"name": "line", "symbols": ["sleepCommand"]},
    {"name": "line", "symbols": ["customCommand"]},
    {"name": "openCommand$string$1", "symbols": [{"literal":"O"}, {"literal":"p"}, {"literal":"e"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "openCommand", "symbols": ["openCommand$string$1", "__", "value"], "postprocess": function (d) {return [d[0], d[2][0]]}},
    {"name": "clickCommand$string$1", "symbols": [{"literal":"C"}, {"literal":"l"}, {"literal":"i"}, {"literal":"c"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "clickCommand", "symbols": ["clickCommand$string$1"]},
    {"name": "clickCommand$string$2", "symbols": [{"literal":"C"}, {"literal":"l"}, {"literal":"i"}, {"literal":"c"}, {"literal":"k"}, {"literal":" "}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "clickCommand", "symbols": ["clickCommand$string$2", "__", "selector"], "postprocess": function (d) {return [d[0], d[2]]}},
    {"name": "clickCommand$string$3", "symbols": [{"literal":"C"}, {"literal":"l"}, {"literal":"i"}, {"literal":"c"}, {"literal":"k"}, {"literal":" "}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "clickCommand", "symbols": ["clickCommand$string$3", "__", "point"]},
    {"name": "commentCommand$ebnf$1", "symbols": []},
    {"name": "commentCommand$ebnf$1", "symbols": [/./, "commentCommand$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "commentCommand", "symbols": [{"literal":"#"}, "commentCommand$ebnf$1"], "postprocess": function(d) {return ["Comment", d[1].join('').trim()]}},
    {"name": "selectCommand$string$1", "symbols": [{"literal":"W"}, {"literal":"i"}, {"literal":"t"}, {"literal":"h"}, {"literal":"i"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "selectCommand", "symbols": ["selectCommand$string$1", "__", "selector"], "postprocess": function(d) {return ["Select", d[2]]}},
    {"name": "selectCommand$string$2", "symbols": [{"literal":"S"}, {"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"c"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "selectCommand", "symbols": ["selectCommand$string$2", "__", "selector"]},
    {"name": "selectCommand$string$3", "symbols": [{"literal":"S"}, {"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"c"}, {"literal":"t"}, {"literal":" "}, {"literal":"v"}, {"literal":"i"}, {"literal":"s"}, {"literal":"i"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "selectCommand", "symbols": ["selectCommand$string$3", "__", "selector"]},
    {"name": "rememberCommand$string$1", "symbols": [{"literal":"R"}, {"literal":"e"}, {"literal":"m"}, {"literal":"e"}, {"literal":"m"}, {"literal":"b"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rememberCommand$string$2", "symbols": [{"literal":"a"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "rememberCommand", "symbols": ["rememberCommand$string$1", "__", "property", "__", "rememberCommand$string$2", "__", "variable"], "postprocess": function(d) {return [d[0], d[2], d[6]]}},
    {"name": "propertyCommand$string$1", "symbols": [{"literal":"P"}, {"literal":"r"}, {"literal":"o"}, {"literal":"p"}, {"literal":"e"}, {"literal":"r"}, {"literal":"t"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "propertyCommand", "symbols": ["propertyCommand$string$1", "__", "property", "__", "condition", "__", "value"], "postprocess": function(d) {return [d[0], d[2], d[4], d[6][0]]}},
    {"name": "typeCommand$string$1", "symbols": [{"literal":"T"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "typeCommand", "symbols": ["typeCommand$string$1", "__", "value"], "postprocess": function(d) {return [d[0], d[2][0]]}},
    {"name": "sleepCommand$string$1", "symbols": [{"literal":"S"}, {"literal":"l"}, {"literal":"e"}, {"literal":"e"}, {"literal":"p"}, {"literal":" "}, {"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sleepCommand$subexpression$1$string$1", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sleepCommand$subexpression$1", "symbols": ["sleepCommand$subexpression$1$string$1"]},
    {"name": "sleepCommand$subexpression$1$string$2", "symbols": [{"literal":"s"}, {"literal":"e"}, {"literal":"c"}, {"literal":"o"}, {"literal":"n"}, {"literal":"d"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "sleepCommand$subexpression$1", "symbols": ["sleepCommand$subexpression$1$string$2"]},
    {"name": "sleepCommand", "symbols": ["sleepCommand$string$1", "__", "int", "__", "sleepCommand$subexpression$1"], "postprocess": function(d) {return ["Sleep", {type: 'timeDelay', unit: 'second', value: d[2]}]}},
    {"name": "customCommand$ebnf$1", "symbols": []},
    {"name": "customCommand$ebnf$1", "symbols": [/./, "customCommand$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "customCommand", "symbols": [{"literal":"!"}, "customCommand$ebnf$1"], "postprocess": function(d) {return ["Custom", d[1].join('').trim()]}},
    {"name": "anyWord$ebnf$1", "symbols": [/[^\s]/]},
    {"name": "anyWord$ebnf$1", "symbols": [/[^\s]/, "anyWord$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "anyWord", "symbols": ["anyWord$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "nqString$ebnf$1", "symbols": [/[^\s\"\'\`\$]/]},
    {"name": "nqString$ebnf$1", "symbols": [/[^\s\"\'\`\$]/, "nqString$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "nqString", "symbols": ["nqString$ebnf$1"], "postprocess": function(d) {return d[0].join(""); }},
    {"name": "elementType$string$1", "symbols": [{"literal":"b"}, {"literal":"u"}, {"literal":"t"}, {"literal":"t"}, {"literal":"o"}, {"literal":"n"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elementType", "symbols": ["elementType$string$1"]},
    {"name": "elementType$string$2", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"e"}, {"literal":"m"}, {"literal":"e"}, {"literal":"n"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elementType", "symbols": ["elementType$string$2"]},
    {"name": "elementType$string$3", "symbols": [{"literal":"l"}, {"literal":"i"}, {"literal":"n"}, {"literal":"k"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elementType", "symbols": ["elementType$string$3"]},
    {"name": "elementType$string$4", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"p"}, {"literal":"u"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elementType", "symbols": ["elementType$string$4"]},
    {"name": "elementType$string$5", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"x"}, {"literal":"t"}, {"literal":"a"}, {"literal":"r"}, {"literal":"e"}, {"literal":"a"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "elementType", "symbols": ["elementType$string$5"]},
    {"name": "selector", "symbols": ["nqString"], "postprocess": function (d) {return {type: 'simpleSelector', value: d[0]}}},
    {"name": "selector", "symbols": ["elementType", "__", "nqString"], "postprocess": function (d) {return {type: 'simpleSelector', elementType: d[0][0], value: d[2]}}},
    {"name": "selector", "symbols": ["btstring"], "postprocess": function (d) {return {type: 'selector', value: d[0]}}},
    {"name": "selector", "symbols": ["elementType", "__", "btstring"], "postprocess": function (d) {return {type: 'selector', elementType: d[0][0], value: d[2]}}},
    {"name": "selector", "symbols": ["variable"], "postprocess": function (d) {return {type: 'selector', value: d[0]}}},
    {"name": "selector", "symbols": ["elementType", "__", "variable"], "postprocess": function (d) {return {type: 'selector', elementType: d[0][0], value: d[2]}}},
    {"name": "property", "symbols": ["propertyType"], "postprocess": function(d) {return {type: 'property', value: d[0][0]}}},
    {"name": "propertyType$string$1", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"x"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "propertyType", "symbols": ["propertyType$string$1"]},
    {"name": "propertyType$string$2", "symbols": [{"literal":"c"}, {"literal":"l"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "propertyType", "symbols": ["propertyType$string$2"]},
    {"name": "propertyType$string$3", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"l"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "propertyType", "symbols": ["propertyType$string$3"]},
    {"name": "value", "symbols": ["variable"]},
    {"name": "value", "symbols": ["stringValue"]},
    {"name": "condition$string$1", "symbols": [{"literal":"s"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"l"}, {"literal":"d"}, {"literal":" "}, {"literal":"b"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition", "symbols": ["condition$string$1"], "postprocess": function(d) {return {type: 'condition', value: 'equal'}}},
    {"name": "condition$string$2", "symbols": [{"literal":"s"}, {"literal":"h"}, {"literal":"o"}, {"literal":"u"}, {"literal":"l"}, {"literal":"d"}, {"literal":" "}, {"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}, {"literal":"b"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "condition", "symbols": ["condition$string$2"], "postprocess": function(d) {return {type: 'condition', value: '!equal'}}},
    {"name": "point", "symbols": [{"literal":"{"}, "int", {"literal":","}, "int", {"literal":"}"}], "postprocess": function (d) {return {type: 'point', value: {x: d[1], y: d[3]}}}},
    {"name": "variable", "symbols": [{"literal":"$"}, "anyWord"], "postprocess": function (d) {return {type: 'variable', value: d[1]}}},
    {"name": "stringValue", "symbols": ["btstring"], "postprocess": function(d) {return {type: 'string', value: d[0]}}}
]
  , ParserStart: "line"
}

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
}
})();
