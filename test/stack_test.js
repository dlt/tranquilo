var assert = require('assert'),
    Stack = require('../lib/stack.js').Stack;

suite("Stack", function() {
    'use strict';

    var stack;

    setup(function() {
        stack = new Stack;
    });

    test("it should save things on the top of the stack", function() {
        stack.push(3);
        stack.push(2);
        assert.equal(stack.pop(), 2);
        assert.equal(stack.pop(), 3);
    });

    test("it should the number of pushes made onto the stack", function() {
        for (var i = 0; i < 10; i ++) {
            stack.push(i);
        }

        assert.equal(stack.pushCount, 10);
    });

    test("it should not allow to push more times than maximum stack size", function() {
        assert.throws(function () {
            stack = new Stack(5);
            for (var i = 0; i < 10; i ++) {
                stack.push(i);
            }
        }, Error, "Stack reached max Depth");
    });
});

