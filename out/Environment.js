"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Environment = void 0;
class Environment {
    assign(name, value) {
        const key = name.lexeme.toString();
        if (Environment.values.has(key)) {
            Environment.values.set(key, value);
            return;
        }
        throw new Error(`Undefined variable ${name.lexeme}`);
    }
    define(name, value) {
        Environment.values.set(name.toString(), value);
    }
    get(name) {
        let key = name.lexeme.toString();
        if (Environment.values.has(key)) {
            return Environment.values.get(key);
        }
        throw new Error(`Undefined variable ${name.lexeme}`);
    }
}
exports.Environment = Environment;
Environment.values = new Map();
