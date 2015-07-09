(function () {
    'use strict';

    var Stack = module.exports.Stack = function(maxDepth) {
        this.array = [];
        this.pushCount = 0;
        this.depth = 0;
        this.maxDepth = maxDepth || 500;
    }

    Stack.prototype.push = function (value) {
        if (this.depth == this.maxDepth) {
            throw new Error("Stack reached max depth");
        }
        this.array.push(value);
        this.pushCount++;
        this.depth++;
    }

    Stack.prototype.pop = function () {
        this.depth--;
        return this.array.pop();
    }

})();
