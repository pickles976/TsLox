"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = void 0;
const Expr_1 = require("./Expr");
const tokentype_1 = require("./tokentype");
class Interpreter extends Expr_1.Visitor {
    constructor() {
        super();
    }
    interpret(expression) {
        try {
            let value = this.evaluate(expression);
            console.log(this.stringify(value));
        }
        catch (err) {
            console.error(err);
        }
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
