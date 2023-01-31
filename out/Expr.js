"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unary = exports.Literal = exports.Grouping = exports.Binary = exports.Visitor = exports.Expr = void 0;
class Expr {
    accept(visitor) { return ""; }
}
exports.Expr = Expr;
class Visitor {
    constructor() { }
    visitBinaryExpr(binary) { return ""; }
    visitGroupingExpr(grouping) { return ""; }
    visitLiteralExpr(literal) { return ""; }
    visitUnaryExpr(unary) { return ""; }
}
exports.Visitor = Visitor;
class Binary extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
exports.Binary = Binary;
class Grouping extends Expr {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
exports.Grouping = Grouping;
class Literal extends Expr {
    constructor(value) {
        super();
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
exports.Literal = Literal;
class Unary extends Expr {
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
exports.Unary = Unary;
