var Scope = exports.Scope = function(params, args, outer) {
    this.outer = outer;
    this.build(params, args);
}

Scope.prototype.build = function(params, args) {
    this.scope = {};

    for (var i in params) {
        var param = params[i],
            name = typeof param.name !== 'undefined' ? param.name : param;

        this.scope[name] = args[i];
    }
}

Scope.prototype.update = function(other) {
    var scopeValues = typeof other.scope !== 'undefined' ? other.scope : other;
    for (var name in scopeValues) {
        this.scope[name] = scopeValues[name];
    }
}

/*
 * Searches for the variable name in the scope chain and returns its value.
 *
 * */
Scope.prototype.find = function(name) {
    if (name in this.scope) {
        return this.scope[name];
    }
    else if (this.outer) {
        return this.outer.find(name);
    }

    throw "No value defined for name: " + name;
}

Scope.prototype.set = function(name, value) {
    this.scope[name] = value;
}
