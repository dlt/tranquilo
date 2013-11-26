var assert = require('assert'),
    Scope = require('../lib/scope.js').Scope,
    noop = function() {},
    scope,
    defaultScope;

suite("Scope", function() {
    setup(function() {
        emptyScope = new Scope([], [], null);
        defaultScope = new Scope(['noop'], [noop], null);
    });

    test("should create a default scope on initialization.", function() {
        assert.equal(0, Object.keys(emptyScope.scope).length);
    });

    test("should update a scope with the values of another", function() {
        emptyScope.update(defaultScope);
        assert.deepEqual(emptyScope.scope, defaultScope.scope);

        emptyScope.update({'': function() {}});
        assert.equal(2, Object.keys(emptyScope.scope).length);
    });

    test("should find a symbol's value", function() {
        assert.equal(noop, defaultScope.find('noop'));
    });

    test("should find a symbol's value in its parent scope", function() {
        defaultScope.set('foo', 'bar');
        var newScope = new Scope([], [], defaultScope);
        assert.equal('bar', defaultScope.find('foo'));
        assert.equal('bar', newScope.find('foo'));
    });
});
