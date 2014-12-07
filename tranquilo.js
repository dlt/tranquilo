/*
 * Tranquilo.js
 *
 * A minimal Scheme interpreter in JavaScript.
 *
 * */
var Parser = require('./lib/parser.js').Parser,
    Runtime = require('./lib/runtime.js').Runtime,
    DEBUG = true;

var REPL = module.exports.REPL = function() {
    var self = this,
        runtime = new Runtime,
        parser = new Parser;

    var readLine = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    readLine.on('line', function(line) {
        if (DEBUG) {
            self.benchmark(function() {
                console.log(self.toSchemeString(runtime.eval(parser.parse(line))));
            });
        } else {
            console.log(self.toSchemeString(runtime.eval(parser.parse(line))));
        }
    });
}

REPL.prototype.benchmark = function(procedure) {
    var start = new Date,
        end,
        diff;

    procedure.apply(this, []);
    end = new Date;
    diff = end.getMilliseconds() - start.getMilliseconds();

    console.log('running time (milliseconds): ' + diff.toString());
}

REPL.prototype.toSchemeString = function(exp) {
    var self = this,
        string;

    if (typeof exp === 'undefined') {
      string = '';
    }
    else if (Array.isArray(exp)) {
        string = exp.map(function(e) { return self.toSchemeString(e); }).join(' ');
        string = '(' + string + ')';
    }
    else {
        string = exp.toString();
    }
    return string;
}

new REPL;
