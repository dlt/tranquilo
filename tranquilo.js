/*
 * Tranquilo.js
 *
 * A minimal Scheme interpreter in JavaScript.
 *
 * */
var Runtime = require('./lib/runtime.js').Runtime,
    Parser = require('./lib/parser.js').Parser;

var REPL = module.exports.REPL = function() {
    var self = this,
        runtime = new Runtime,
        parser = new Parser();

    var readLine = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    readLine.on('line', function(line) {
         var val = runtime.eval(parser.parse(line));
         if (val) {
             console.log(val);
         }
    });
}

REPL.prototype.toSchemeString = function(exp) {
    var self = this,
        string;

    if (Array.isArray(exp)) {
        string = exp.map(function(e) { return self.toSchemeString(e); }).join('');
    }
    else {
        string = exp.toString();
    }
    return '(' + string + ')';
}

new REPL;
