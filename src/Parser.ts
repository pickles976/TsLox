import { equal, match } from "assert";
import { Assign, Binary, Expr, Grouping, Literal, Unary, Variable } from "./Expr";
import { Token } from "./token";
import { TokenType } from "./tokentype";
import { parseError } from ".";
import { type } from "os";
import { Expression, Print, Stmt, Var } from "./Stmt";

export class Parser {

    tokens: Token[]
    current: number = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() : Stmt[] {
        let statements = []
        while (!this.isAtEnd()) {
            // statements.push(this.statement())
            statements.push(this.declaration())
        }
        return statements
    }

    declaration() : Stmt {
        try {
            if (this.match(TokenType.VAR)) {
                return this.varDeclaration()
            }
            return this.statement()
        } catch (err) {
            this.synchronize()
            return new Stmt()
        }
    }

    varDeclaration() : Stmt {
        let name : Token = this.consume(TokenType.IDENTIFIER, "Expect variable name")

        let initializer : Expr = new Expr()

        if (this.match(TokenType.EQUAL)) {
            initializer = this.expression()
        }

        this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.")
        return new Var(name, initializer)
    }

    statement() : Stmt {
        if (this.match(TokenType.PRINT)) return this.printStatement()
        return this.expressionStatement()
    }

    expressionStatement() : Stmt {
        let expr : Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' adter expression.")
        return new Expression(expr)
    }

    printStatement() : Stmt {
        let value : Expr = this.expression()
        this.consume(TokenType.SEMICOLON, "Expect ';' after value.")
        return new Print(value)
    }

    expression() : Expr {
        return this.assignment()
    }

    assignment() {
    
        let expr = this.equality()

        if (this.match(TokenType.EQUAL)) {
            let equals: Token = this.previous()
            let value: Expr = this.assignment()

            if (expr instanceof Variable) {
                let name : Token = new Variable(expr.name).name
                return new Assign(name, value)
            }

            this.error(equals, "Invalid assignment target")
        }
        return expr
    }

    // == | !=
    equality() : Expr {
        let expr : Expr = this.comparison()
        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            let operator: Token = this.previous()
            let right: Expr = this.comparison()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    // > | >= | < | <=
    comparison() : Expr {
        let expr: Expr = this.term()

        while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
            let operator: Token = this.previous()
            let right : Expr = this.term()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    // - | +
    term() : Expr {
        let expr: Expr = this.factor()

        while(this.match(TokenType.MINUS, TokenType.PLUS)) {
            let operator: Token = this.previous()
            let right: Expr = this.factor()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    // * | /
    factor() : Expr {
        let expr: Expr = this.unary()

        while(this.match(TokenType.SLASH, TokenType.STAR)) {
            let operator: Token = this.previous()
            let right: Expr = this.unary()
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    // ! | -
    unary() : Expr {

        if(this.match(TokenType.BANG, TokenType.MINUS)) {
            let operator: Token = this.previous()
            let right : Expr = this.unary()
            return new Unary(operator, right)
        }
        return this.primary()
    }   

    //
    primary() : Expr {

        if (this.match(TokenType.FALSE)) { return new Literal(false) }
        if (this.match(TokenType.TRUE)) { return new Literal(true) }
        if (this.match(TokenType.NIL)) { return new Literal(null) }

        if (this.match(TokenType.NUMBER, TokenType.STRING))  { return new Literal(this.previous().literal) }

        if (this.match(TokenType.IDENTIFIER)) {
            return new Variable(this.previous())
        }

        if (this.match(TokenType.LEFT_PAREN)) {
            let expr : Expr = this.expression()
            this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
            return new Grouping(expr)
        }

        throw this.error(this.peek(), "Expect expression.")
    }

    consume(type: TokenType, message: String) : Token {
        if (this.check(type)) { return this.advance() }
        throw this.error(this.peek(), message)
    }

    error(token: Token, message: String) {
        parseError(token, message)
        return new ParseError()
    }

    // discard tokens until the next statement
    synchronize() {
        this.advance()
        while (!this.isAtEnd()) {
            if (this.previous().type == TokenType.SEMICOLON) return;

            switch (this.peek().type) {
                case TokenType.CLASS: 
                case TokenType.FOR:
                case TokenType.FUN:
                case TokenType.IF: 
                case TokenType.PRINT:
                case TokenType.RETURN:
                case TokenType.VAR: 
                case TokenType.WHILE:
                    return
            }

            this.advance()
        }
    }

    match(...types: TokenType[]) : boolean {

        for (let i = 0; i < types.length; i++) {
            if (this.check(types[i])) {
                this.advance()
                return true
            }
        }
        return false
    }

    check(type: TokenType) : boolean {
        if (this.isAtEnd()) {
            return false
        }
        return (this.peek().type === type)
    }

    advance() : Token {
        if (!this.isAtEnd()) { this.current++ }
        return this.previous()
    }

    isAtEnd() :boolean {
        return this.peek().type === TokenType.EOF
    }

    peek() : Token {
        return this.tokens[this.current]
    }

    previous() : Token {
        return this.tokens[this.current - 1]
    }

}

class ParseError extends EvalError {

}