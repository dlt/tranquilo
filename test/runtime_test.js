var assert = require('assert'),
    Runtime = require('../lib/runtime.js').Runtime,
    Parser = require('../lib/parser.js').Parser,
    runtime,
    parser,
    eval,
    builtIn;

suite("Runtime", function() {

    setup(function() {
        parser = new Parser;
        runtime = new Runtime;
        builtIn = runtime.globalScope.scope;

        eval = function(str) {
            return runtime.eval(parser.parse(str));
        }
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
        assert.equal(true, nil(builtIn.list()));
        assert.equal(false, nil(builtIn.list(1, 2)));
    });

    suite("Runtime.eval", function() {
        test("it should apply built-in functions", function() {
            var program = "(+ 2 2)";
            assert.equal(4, eval(program));

            program = "(+ 2 2 2)";
            assert.equal(6, eval(program));

            program = "(+ 12 2 2)";
            assert.equal(16, eval(program));


            program = "(+ 12 2 (- 20 10))";
            assert.equal(24, eval(program));

            program = "(+ 12 (- 20 10) 2)";
            assert.equal(24, eval(program));
        });

        test("it should support application", function() {
            var program = "((lambda (x) (* x x)) 5)";
            assert.equal(25, eval(program));
        });

        test("it should support nested lambda applications", function() {
            var program = "(((lambda (x) (lambda (y) (+ y x))) 3) 4)";
            assert.equal(7, eval(program));
        });

        test("it should implement the 'if' special form", function() {
            var program = "(if (> 3 2) (if (< 5 10) 10 5) 2)";
            assert.equal(10, eval(program));
        });

        test("it should implement the 'begin' special form", function() {
            var program = "(begin (if (< 5 10) 10 5) (> 3 2))";
            assert.equal(true, eval(program));
        });

        test("it should implement the 'set!' special form", function() {
            var program = "(begin (set! z (* 3 2)) z)";
            assert.equal(6, eval(program));
        });

        test("it should implement the 'define' special form", function() {
            var program = "(begin (define zz (* 10 10)) zz)";
            assert.equal(100, eval(program));
        });


        test("it should implement the 'define' special form", function() {
            var program = '(map (lambda (x) (* 2 x)) (list 1 2 4))';
            assert.deepEqual([2, 4, 8], eval(program));
        });
    });
});
