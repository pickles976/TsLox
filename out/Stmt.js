"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Var = exports.Print = exports.Expression = exports.Stmt = void 0;
class Stmt {
    accept(visitor) { return null; }
}
exports.Stmt = Stmt;
class Expression extends Stmt {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitExpressionStmt(this);
    }
}
exports.Expression = Expression;
class Print extends Stmt {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitPrintStmt(this);
    }
}
exports.Print = Print;
class Var extends Stmt {
    constructor(name, initializer) {
        super();
        this.name = name;
        this.initializer = initializer;
    }
    accept(visitor) {
        return visitor.visitVarStmt(this);
    }
}
exports.Var = Var;
