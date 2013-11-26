var assert = require('assert'),
    Runtime = require('../lib/runtime.js').Runtime,
    runtime,
    builtIn;

suite("Runtime", function() {
    setup(function() {
        runtime = new Runtime();
        builtIn = runtime.globalScope.scope;
    });

    test("builtIn['+']", function() {
        assert.equal(1, builtIn['+'](1));
        assert.equal(4, builtIn['+'](2, 2));
        assert.equal(6, builtIn['+'](2, 2, 2));
    });

    test("builtIn['-']", function() {
        assert.equal(-1, builtIn['-'](1));
        assert.equal(0, builtIn['-'](2, 2));
        assert.equal(-2, builtIn['-'](2, 2, 2));
        assert.equal(-3, builtIn['-'](2, 2, 3));
    });

    test("builtIn['*']", function() {
        assert.equal(1, builtIn['*'](1));
        assert.equal(4, builtIn['*'](2, 2));
        assert.equal(8, builtIn['*'](2, 2, 2));
        assert.equal(0, builtIn['*'](2, 2, 2, 0));
    });

    test("builtIn['/']", function() {
        assert.equal(1, builtIn['/'](1, 1));
        assert.equal(1, builtIn['/'](2, 2));
        assert.equal(2, builtIn['/'](12, 6));
        assert.equal(1, builtIn['/'](12, 6, 2));
    });

    test("builtIn['not']", function() {
        assert.equal(false, builtIn['not'](true));
        assert.equal(true, builtIn['not'](false));
    });

    test("builtIn['>']", function() {
        assert.equal(false, builtIn['>'](5, 10));
        assert.equal(false, builtIn['>'](5, 5));
        assert.equal(true, builtIn['>'](10, 5));
    });

    test("builtIn['<']", function() {
        assert.equal(true, builtIn['<'](5, 10));
        assert.equal(false, builtIn['<'](10, 5));
        assert.equal(false, builtIn['<'](10, 10));
    });

    test("builtIn['>=']", function() {
        assert.equal(true, builtIn['>='](5, 5));
        assert.equal(true, builtIn['>='](10, 5));
        assert.equal(false, builtIn['>='](4, 5));
    });

    test("builtIn['<=']", function() {
        assert.equal(true, builtIn['<='](5, 5));
        assert.equal(false, builtIn['<='](10, 5));
        assert.equal(true, builtIn['<='](4, 5));
    });

    test("builtIn['=']", function() {
        assert.equal(true, builtIn['='](5, 5));
        assert.equal(false, builtIn['='](10, 5));
    });

    test("builtIn['length']", function() {
        assert.equal(0, builtIn['length']([]));
        assert.equal(1, builtIn['length']([1]));
        assert.equal(2, builtIn['length']([1, 2]));
    });

    test("builtIn['cons']", function() {
        var cons = builtIn['cons'];
        assert.deepEqual([1], cons(1, []));
        assert.deepEqual([1, 2], cons(1, [2]));
        assert.deepEqual([1, 2, 3], cons(1, cons(2, [3])));
    });

    test("builtIn['car']", function() {
        var car = builtIn['car'],
            cons = builtIn['cons'];
        assert.equal(1, car([1, 2, 3]));
        assert.equal(1, car(cons(1, [2])));
    });

    test("builtIn['cdr']", function() {
        var cons = builtIn['cons'],
            cdr = builtIn['cdr'];

        assert.deepEqual([2, 3], cdr([1, 2, 3]));
        assert.deepEqual([2], cdr(cons(1, [2])));
    });

    test("builtIn['list']", function() {
        assert.deepEqual([1, 2, 3], builtIn.list(1, 2, 3));
        assert.deepEqual([1, 2], builtIn.list(1, 2));
        assert.deepEqual([], builtIn.list());
    });

    test("builtIn['null?']", function() {
        var nil = builtIn['null?'];
        assert.deepEqual(true, nil(builtIn.list()));
        assert.deepEqual(false, nil(builtIn.list(1, 2)));
    });
});
