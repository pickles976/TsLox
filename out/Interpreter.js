"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const Expr_1 = require("./Expr");
const tokentype_1 = require("./tokentype");
const Environment_1 = require("./Environment");
class Interpreter extends Expr_1.Visitor {
    constructor() {
        super();
        this.environment = new Environment_1.Environment();
    }
    interpret(statements) {
        try {
            statements.forEach((statement) => {
                this.execute(statement);
            });
        }
        catch (err) {
            console.error(err);
        }
    }
    execute(stmt) {
        stmt.accept(this);
    }
    stringify(object) {
        if (object == null)
            return "nil";
        if (typeof object == "number") {
            let text = object.toString();
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2);
            }
            return text;
        }
        return object.toString();
    }
    visitAssignExpr(expr) {
        let value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
        return value;
    }
    visitLiteralExpr(expr) {
        return expr.value;
    }
    visitGroupingExpr(expr) {
        return this.evaluate(expr.expression);
    }
    visitUnaryExpr(expr) {
        let right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case tokentype_1.TokenType.BANG:
                return !this.isTruthy(right);
            case tokentype_1.TokenType.MINUS:
                return -(+right);
        }
        return null;
    }
    visitVariableExpr(expr) {
        return this.environment.get(expr.name);
    }
    visitBinaryExpr(expr) {
        let left = this.evaluate(expr.left);
        let right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case tokentype_1.TokenType.GREATER:
                return +left > +right;
            case tokentype_1.TokenType.GREATER_EQUAL:
                return +left >= +right;
            case tokentype_1.TokenType.LESS:
                return +left < +right;
            case tokentype_1.TokenType.LESS_EQUAL:
                return +left <= +right;
            case tokentype_1.TokenType.MINUS:
                return +left - +right;
            case tokentype_1.TokenType.BANG_EQUAL:
                return !this.isEqual(left, right);
            case tokentype_1.TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right);
            case tokentype_1.TokenType.PLUS:
                if (typeof left == "number" && typeof right == "number") {
                    return left + right;
                }
                if (typeof left == "string" && typeof right == "string") {
                    return left + right;
                }
                break;
            case tokentype_1.TokenType.SLASH:
                return +left / +right;
            case tokentype_1.TokenType.STAR:
                return +left * +right;
        }
        return null;
    }
    visitExpressionStmt(expr) {
        this.evaluate(expr.expression);
        return null;
    }
    visitPrintStmt(print) {
        let val = this.evaluate(print.expression);
        console.log(this.stringify(val));
        return null;
    }
    visitVarStmt(stmt) {
        let value = null;
        if (stmt.initializer != null) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
        return null;
    }
    visitBlockStmt(stmt) {
        this.executeBlock(stmt.statements, new Environment_1.Environment(this.environment));
        return null;
    }
    executeBlock(statments, environment) {
        let previous = this.environment;
        try {
            this.environment = environment;
            statments.forEach((statement) => {
                this.execute(statement);
            });
        }
        finally {
            this.environment = previous;
        }
    }
    evaluate(expr) {
        return expr.accept(this);
    }
    isTruthy(object) {
        if (object == null)
            return false;
        if (object instanceof Boolean)
            return Boolean(object);
        return true;
    }
    isEqual(a, b) {
        if (a == null && b == null)
            return true;
        if (a == null)
            return false;
        return a === b;
    }
}
exports.Interpreter = Interpreter;
