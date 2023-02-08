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
            statements.push(this.declaration());
        }
        return statements;
    }
    declaration() {
        try {
            if (this.match(tokentype_1.TokenType.VAR)) {
                return this.varDeclaration();
            }
            return this.statement();
        }
        catch (err) {
            this.synchronize();
            return new Stmt_1.Stmt();
        }
    }
    varDeclaration() {
        let name = this.consume(tokentype_1.TokenType.IDENTIFIER, "Expect variable name");
        let initializer = new Expr_1.Expr();
        if (this.match(tokentype_1.TokenType.EQUAL)) {
            initializer = this.expression();
        }
        this.consume(tokentype_1.TokenType.SEMICOLON, "Expect ';' after variable declaration.");
        return new Stmt_1.Var(name, initializer);
    }
    whileStatement() {
        this.consume(tokentype_1.TokenType.LEFT_PAREN, "Expect '(' after while");
        let condition = this.expression();
        this.consume(tokentype_1.TokenType.RIGHT_PAREN, "Expect ')' after condition");
        let body = this.statement();
        return new Stmt_1.While(condition, body);
    }
    statement() {
        if (this.match(tokentype_1.TokenType.FOR))
            return this.forStatement();
        if (this.match(tokentype_1.TokenType.IF))
            return this.ifStatement();
        if (this.match(tokentype_1.TokenType.PRINT))
            return this.printStatement();
        if (this.match(tokentype_1.TokenType.WHILE))
            return this.whileStatement();
        if (this.match(tokentype_1.TokenType.LEFT_BRACE))
            return new Stmt_1.Block(this.block());
        return this.expressionStatement();
    }
    forStatement() {
        this.consume(tokentype_1.TokenType.LEFT_PAREN, "Expect '(' after 'for'");
        let initializer = null;
        if (this.match(tokentype_1.TokenType.SEMICOLON)) {
            initializer = null;
        }
        else if (this.match(tokentype_1.TokenType.VAR)) {
            initializer = this.varDeclaration();
        }
        else {
            initializer = this.expressionStatement();
        }
        let condition = null;
        if (!this.check(tokentype_1.TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(tokentype_1.TokenType.SEMICOLON, "Epect ';' after loop condition");
        let increment = null;
        if (!this.check(tokentype_1.TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(tokentype_1.TokenType.RIGHT_PAREN, "Expect ')' after for clauses");
        let body = this.statement();
        if (increment != null) {
            body = new Stmt_1.Block([body, new Stmt_1.Expression(increment)]);
        }
        if (condition === null) {
            condition = new Expr_1.Literal(true);
        }
        body = new Stmt_1.While(condition, body);
        if (initializer != null) {
            body = new Stmt_1.Block([initializer, body]);
        }
        return body;
    }
    block() {
        let statements = [];
        while (!this.check(tokentype_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            statements.push(this.declaration());
        }
        this.consume(tokentype_1.TokenType.RIGHT_BRACE, "Expect '} after block");
        return statements;
    }
    expressionStatement() {
        let expr = this.expression();
        this.consume(tokentype_1.TokenType.SEMICOLON, "Expect ';' after expression.");
        return new Stmt_1.Expression(expr);
    }
    printStatement() {
        let value = this.expression();
        this.consume(tokentype_1.TokenType.SEMICOLON, "Expect ';' after value.");
        return new Stmt_1.Print(value);
    }
    ifStatement() {
        this.consume(tokentype_1.TokenType.LEFT_PAREN, "Expect '(' after 'if'");
        let condition = this.expression();
        this.consume(tokentype_1.TokenType.RIGHT_PAREN, "Expect ')' after if condition");
        let thenBranch = this.statement();
        let elseBranch = null;
        if (this.match(tokentype_1.TokenType.ELSE)) {
            elseBranch = this.statement();
        }
        return new Stmt_1.If(condition, thenBranch, elseBranch);
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        let expr = this.or();
        if (this.match(tokentype_1.TokenType.EQUAL)) {
            let equals = this.previous();
            let value = this.assignment();
            if (expr instanceof Expr_1.Variable) {
                let name = new Expr_1.Variable(expr.name).name;
                return new Expr_1.Assign(name, value);
            }
            this.error(equals, "Invalid assignment target");
        }
        return expr;
    }
    or() {
        let expr = this.and();
        while (this.match(tokentype_1.TokenType.OR)) {
            let operator = this.previous();
            let right = this.and();
            expr = new Expr_1.Logical(expr, operator, right);
        }
        return expr;
    }
    and() {
        let expr = this.equality();
        while (this.match(tokentype_1.TokenType.AND)) {
            let operator = this.previous();
            let right = this.equality();
            expr = new Expr_1.Logical(expr, operator, right);
        }
        return expr;
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
        if (this.match(tokentype_1.TokenType.IDENTIFIER)) {
            return new Expr_1.Variable(this.previous());
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
