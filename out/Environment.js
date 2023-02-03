"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    constructor(enclosing) {
        this.values = new Map();
        this.enclosing = enclosing !== null && enclosing !== void 0 ? enclosing : null;
    }
    assign(name, value) {
        const key = name.lexeme.toString();
        if (this.values.has(key)) {
            this.values.set(key, value);
            return;
        }
        if (this.enclosing != null) {
            this.enclosing.assign(name, value);
            return;
        }
        throw new Error(`Undefined variable ${name.lexeme}`);
    }
    define(name, value) {
        this.values.set(name.toString(), value);
    }
    get(name) {
        let key = name.lexeme.toString();
        if (this.values.has(key)) {
            return this.values.get(key);
        }
        if (this.enclosing != null) {
            return this.enclosing.get(name);
        }
        throw new Error(`Undefined variable ${name.lexeme}`);
    }
}
exports.Environment = Environment;
