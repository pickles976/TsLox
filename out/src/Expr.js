"use strict";
/**
 * Represents a Grammar structure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variable = exports.Unary = exports.Logical = exports.Literal = exports.Grouping = exports.Binary = exports.Assign = exports.Visitor = exports.Expr = void 0;
class Expr {
    accept(visitor) { return ""; }
}
exports.Expr = Expr;
class Visitor {
    constructor() { }
    visitBlockStmt(block) { return null; }
    visitAssignExpr(assign) { return ""; }
    visitBinaryExpr(binary) { return ""; }
    visitGroupingExpr(grouping) { return ""; }
    visitLiteralExpr(literal) { return ""; }
    visitLogicalExpr(logical) { return ""; }
    visitUnaryExpr(unary) { return ""; }
    visitExpressionStmt(expression) { return null; }
    visitIfStmt(i) { return ""; }
    visitPrintStmt(print) { return null; }
    visitWhileStmt(whl) { return ""; }
    visitVarStmt(variable) { return null; }
    visitVariableExpr(variable) { return ""; }
}
exports.Visitor = Visitor;
class Assign extends Expr {
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitAssignExpr(this);
    }
}
exports.Assign = Assign;
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
class Logical extends Expr {
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitLogicalExpr(this);
    }
}
exports.Logical = Logical;
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
class Variable extends Expr {
    constructor(name) {
        super();
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitVariableExpr(this);
    }
}
exports.Variable = Variable;
