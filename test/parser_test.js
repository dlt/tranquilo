var assert = require('assert'),
    Parser = require('../lib/parser.js').Parser,
    Symbol = require('../lib/parser.js').Symbol;

function debugTransform(tree) {
    var newTree = [];
    for (var i in tree) {
        var node = tree[i];

        if (typeof node.getName != 'undefined') {
            newTree.push(node.getName());
        } else if (Array.isArray(node)) {
            newTree.push(debugTransform(node));
        } else {
            newTree.push(node);
        }
    }
    return newTree;
}

suite("Parser", function() {
    var program, parser;

    setup(function() {
        program = "(set! twox (* x 2))",
        parser = new Parser;
    });

    test("it should tokenize the string", function() {
        var expectedTokens = ['(', 'set!', 'twox', '(', '*', 'x', '2', ')', ')'];
        assert.deepEqual(parser.tokenize(program), expectedTokens);
    });

    test("it should parse the program", function() {
        var expectedTree = ['set!', 'twox', ['*', 'x', 2]],
            tree = parser.parse(program),
            tree = debugTransform(tree);

        assert.deepEqual(tree, expectedTree);
    });
});


