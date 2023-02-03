"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Print = exports.Expression = exports.Visitor = exports.Stmt = void 0;
class Stmt {
    accept(visitor) { return ""; }
}
exports.Stmt = Stmt;
class Visitor {
    constructor() { }
    visitExpressionStmt(expression) { return ""; }
    visitPrintStmt(print) { return ""; }
}
exports.Visitor = Visitor;
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
