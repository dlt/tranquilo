var Parser = module.exports.Parser = function() {
}

/*
 * Tokenizes a string and returns a nested array of tokens.
 */
Parser.prototype.tokenize = function(string) {
    return string.replace(/\(/g, ' ( ')
            .replace(/\)/g, ' ) ')
            .split(/\s+/)
            .map(function(s) { return s.trim(); })
            .filter(function(s) { return s.length; });
}

Parser.prototype.read = function(string) {
    return this.readFrom(this.tokenize(string));
}

Parser.prototype.parse = Parser.prototype.read;

Parser.prototype.readFrom = function(tokens) {
    if (tokens.length == 0) {
        throw "unexpected EOF while reading.";
    }
    var token = tokens.shift();

    if (token === '(') {
        var atom = [];
        while (tokens[0] !== ')') {
            atom.push(this.readFrom(tokens));
        }
        tokens.shift();
        return atom;
    }
    else if (token === ')') {
        throw "Unexpected ')'";
    }
    else {
        return this.atom(token);
    }
}

Parser.prototype.atom = function(token) {
    var val = parseFloat(token);

    if (!isNaN(val)) {
        return val;
    }

    val = parseInt(token);
    if (!isNaN(val)) {
        return val;
    }
    // assumes token is a symbol
    return new Symbol(token);
}

var Symbol = module.exports.Symbol = function(name) {
    this.name = name;
    var self = this,
        symbol = {};
    symbol.getName = function() { return self.name; };
    symbol.prototype = Symbol.prototype;
    symbol.constructor = Symbol.constructor;
    symbol.name = symbol.getName();

    return symbol;
}

