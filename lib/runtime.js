var Scope = require("./scope.js").Scope;

/*
 * Runtime constructor.
 *
 **/
var Runtime = exports.Runtime = function() {
    this.createGlobalScope();
}

/*
 * Evaluates an s-expression.
 *
 * */
Runtime.prototype.eval = function(expression, scope) {
    var self = this;
    if (!scope) {
        scope = this.globalScope;
    }

    if (typeof expression.getName != 'undefined') {
        var value = scope.find(expression.getName());
        console.log('SYMBOL(value: ' + value + ')');
        return value;
    }
    if (!Array.isArray(expression)) {
        console.log(typeof expression)
        console.log("LITERAL(value: "+ expression  +")");
        return expression;
    }

    switch (expression[0]) {
        case 'quote':
            console.log('quote');
            return expression[1];

        case 'if':
            console.log('if');
            var test = expression[1],
                conseq = expression[2],
                alt = expression[3];

            if (this.eval(test, scope)) {
                return this.eval(conseq, scope);
            }
            else {
                return this.eval(alt, scope);
            }

        case 'define':
        case 'set!':
            console.log('define|set!')
            var name = expression[1],
                exp = expression[2];
            scope.set(name, this.eval(exp, scope));
            break;

        case 'begin':
            console.log('begin')
            return self.scope.find('cdr')(expression).map(function(exp) {
                return self.eval(exp, scope);
            }).pop();

        case 'lambda':
            console.log('lambda')
            var vars = expression[1],
                exp = expression[2];

            return function() {
                var parentScope = this,
                    args = argsToArray(arguments);
                return self.eval(exp, new Scope(vars, args, parentScope));
            };

        default:
            var exps = expression.map(function(exp) { return self.eval(exp, scope); }),
                proc = exps.shift();
            return proc.apply(scope, exps);
    }
}

// Helper function used to convert all arguments of a function into a single array.
function argsToArray(args) {
    return [].slice.call(args, 0);
}

function isJSPrimitive(expression) {
    var primitives = ['object', 'number', 'string', 'boolean', 'undefined', 'function'];
    return primitives.indexOf(typeof expression) !== -1;
}

/*
 * Creates the global scope object and assigns some defaults built-in functions to it.
 *
 * */
Runtime.prototype.createGlobalScope = function() {
    this.globalScope = new Scope([], [], null);
    this.globalScope.update({

        '+': function() {
            var args = argsToArray(arguments);
            return args.reduce(function(a, b) { return a + b; });
        },

        '-': function() {
            var args = argsToArray(arguments),
                total = args.shift();

            if (args.length == 0) {
                return -total;
            }

            return args.reduce(function(total, a) { return total -= a; }, total);
        },

        '*': function() {
            var args = argsToArray(arguments);
            return args.reduce(function(a, b) { return a * b; });
        },

        '/': function() {
            var args = argsToArray(arguments);
            return args.reduce(function(a, b) { return a / b; });
        },

        'not': function(value) {
            return !value;
        },

        '>': function(a, b) {
            return a > b;
        },

        '<': function(a, b) {
            return a < b;
        },

        '>=': function(a, b) {
            return a >= b;
        },

        '<=': function(a, b) {
            return a <= b;
        },

        '=': function(a, b) {
            return a === b;
        },

        'length': function(list) {
            return list.length;
        },

        'cons': function(first, rest) {
            return [first].concat(rest);
        },

        'car': function(list) {
            return list[0];
        },

        'cdr': function(list) {
            return list.slice(1, list.length);
        },

        'list': function() {
            return [].slice.apply(arguments);
        },

        'null?': function(list) {
            return list.length === 0;
        }
    });
}


