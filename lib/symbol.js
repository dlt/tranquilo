(function () {
    'use strict';

    var Symbol = module.exports.Symbol = function(name) {
        this.name = name;
    }

    var Sym = module.exports.Sym = function(s, symbolTable) {
        if (!(s in symbolTable)) {
            symbolTable[s] = new Symbol(s);
        }
        return symbolTable[s];
    }
    var SYMBOLS = module.exports.SYMBOLS = {};

    'quote if set! define lambda begin definemacro quasiquote unquote unquote-splicing'
        .split(' ').forEach(function(kw) {
        Sym(kw, SYMBOLS);
    });
})();

