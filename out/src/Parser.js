"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Expr_1 = require("./Expr");
const tokentype_1 = require("./tokentype");
const _1 = require(".");
const Stmt_1 = require("./Stmt");
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    parse() {
        let statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.statement());
        }
        return statements;
    }
    statement() {
        if (this.match(tokentype_1.TokenType.PRINT))
            return this.printStatement();
        return this.expressionStatement();
    }
    expressionStatement() {
        let expr = this.expression();
        this.consume(tokentype_1.TokenType.SEMICOLON, "Expect ';' adter expression.");
        return new Stmt_1.Expression(expr);
    }
    printStatement() {
        let value = this.expression();
        this.consume(tokentype_1.TokenType.SEMICOLON, "Expect ';' after value.");
        return new Stmt_1.Print(value);
    }
    expression() {
        return this.equality();
    }
    // == | !=
    equality() {
        let expr = this.comparison();
        while (this.match(tokentype_1.TokenType.BANG_EQUAL, tokentype_1.TokenType.EQUAL_EQUAL)) {
            let operator = this.previous();
            let right = this.comparison();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    // > | >= | < | <=
    comparison() {
        let expr = this.term();
        while (this.match(tokentype_1.TokenType.GREATER, tokentype_1.TokenType.GREATER_EQUAL, tokentype_1.TokenType.LESS, tokentype_1.TokenType.LESS_EQUAL)) {
            let operator = this.previous();
            let right = this.term();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    // - | +
    term() {
        let expr = this.factor();
        while (this.match(tokentype_1.TokenType.MINUS, tokentype_1.TokenType.PLUS)) {
            let operator = this.previous();
            let right = this.factor();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    // * | /
    factor() {
        let expr = this.unary();
        while (this.match(tokentype_1.TokenType.SLASH, tokentype_1.TokenType.STAR)) {
            let operator = this.previous();
            let right = this.unary();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    // ! | -
    unary() {
        if (this.match(tokentype_1.TokenType.BANG, tokentype_1.TokenType.MINUS)) {
            let operator = this.previous();
            let right = this.unary();
            return new Expr_1.Unary(operator, right);
        }
        return this.primary();
    }
    //
    primary() {
        if (this.match(tokentype_1.TokenType.FALSE)) {
            return new Expr_1.Literal(false);
        }
        if (this.match(tokentype_1.TokenType.TRUE)) {
            return new Expr_1.Literal(true);
        }
        if (this.match(tokentype_1.TokenType.NIL)) {
            return new Expr_1.Literal(null);
        }
        if (this.match(tokentype_1.TokenType.NUMBER, tokentype_1.TokenType.STRING)) {
            return new Expr_1.Literal(this.previous().literal);
        }
        if (this.match(tokentype_1.TokenType.LEFT_PAREN)) {
            let expr = this.expression();
            this.consume(tokentype_1.TokenType.RIGHT_PAREN, "Expect ')' after expression.");
            return new Expr_1.Grouping(expr);
        }
        throw this.error(this.peek(), "Expect expression.");
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this.error(this.peek(), message);
    }
    error(token, message) {
        (0, _1.parseError)(token, message);
        return new ParseError();
    }
    // discard tokens until the next statement
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type == tokentype_1.TokenType.SEMICOLON)
                return;
            switch (this.peek().type) {
                case tokentype_1.TokenType.CLASS:
                case tokentype_1.TokenType.FOR:
                case tokentype_1.TokenType.FUN:
                case tokentype_1.TokenType.IF:
                case tokentype_1.TokenType.PRINT:
                case tokentype_1.TokenType.RETURN:
                case tokentype_1.TokenType.VAR:
                case tokentype_1.TokenType.WHILE:
                    return;
            }
            this.advance();
        }
    }
    match(...types) {
        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    check(type) {
        if (this.isAtEnd()) {
            return false;
        }
        return (this.peek().type === type);
    }
    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    isAtEnd() {
        return this.peek().type === tokentype_1.TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
}
exports.Parser = Parser;
class ParseError extends EvalError {
}
