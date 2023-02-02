import { match } from "assert";
import { Binary, Expr, Grouping, Literal, Unary } from "./Expr";
import { Token } from "./token";
import { TokenType } from "./tokentype";
import { parseError } from ".";
import { type } from "os";

export class Parser {

    tokens: Token[]
    current: number = 0

    constructor(tokens: Token[]) {
        this.tokens = tokens
    }

    parse() : Expr | null {
        try {
            return this.expression()
        } catch (error) {
            return null
        }
    }

    expression() : Expr {
        return this.equality()
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