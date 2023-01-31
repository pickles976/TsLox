"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const _1 = require(".");
const token_1 = require("./token");
const tokentype_1 = require("./tokentype");
let keywords = {
    "and": tokentype_1.TokenType.AND,
    "class": tokentype_1.TokenType.CLASS,
    "else": tokentype_1.TokenType.ELSE,
    "false": tokentype_1.TokenType.FALSE,
    "for": tokentype_1.TokenType.FOR,
    "fun": tokentype_1.TokenType.FUN,
    "if": tokentype_1.TokenType.IF,
    "nil": tokentype_1.TokenType.NIL,
    "or": tokentype_1.TokenType.OR,
    "print": tokentype_1.TokenType.PRINT,
    "return": tokentype_1.TokenType.RETURN,
    "super": tokentype_1.TokenType.SUPER,
    "this": tokentype_1.TokenType.THIS,
    "true": tokentype_1.TokenType.TRUE,
    "var": tokentype_1.TokenType.VAR,
    "while": tokentype_1.TokenType.WHILE,
};
let map = new Map(Object.entries(keywords));
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.source = source;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new token_1.Token(tokentype_1.TokenType.EOF, "", {}, this.line));
        return this.tokens;
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            // single char tokens
            case '(':
                this.addToken(tokentype_1.TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(tokentype_1.TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(tokentype_1.TokenType.RIGHT_BRACE);
                break;
            case '}':
                this.addToken(tokentype_1.TokenType.LEFT_BRACE);
                break;
            case ',':
                this.addToken(tokentype_1.TokenType.COMMA);
                break;
            case '.':
                this.addToken(tokentype_1.TokenType.DOT);
                break;
            case '-':
                this.addToken(tokentype_1.TokenType.MINUS);
                break;
            case '+':
                this.addToken(tokentype_1.TokenType.PLUS);
                break;
            case ';':
                this.addToken(tokentype_1.TokenType.SEMICOLON);
                break;
            case '*':
                this.addToken(tokentype_1.TokenType.STAR);
                break;
            // compound operators
            case '!':
                this.addToken(this.match('=') ? tokentype_1.TokenType.BANG_EQUAL : tokentype_1.TokenType.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? tokentype_1.TokenType.EQUAL_EQUAL : tokentype_1.TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? tokentype_1.TokenType.LESS_EQUAL : tokentype_1.TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? tokentype_1.TokenType.GREATER_EQUAL : tokentype_1.TokenType.GREATER);
                break;
            // division or comments
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) {
                        this.advance();
                    }
                }
                else {
                    this.addToken(tokentype_1.TokenType.SLASH);
                }
                break;
            // whitespace
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            // string literals
            case '"':
                this.string();
                break;
            // num literals + unexpected chars
            default:
                if (this.isDigit(c)) {
                    this.number();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    (0, _1.error)(this.line, "Unexpected character");
                }
                break;
        }
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(type) {
        this.addTokenLit(type, {});
    }
    addTokenLit(type, literal) {
        let text = this.source.substring(this.start, this.current);
        this.tokens.push(new token_1.Token(type, text, literal, this.line));
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        if (this.source.charAt(this.current) != expected)
            return false;
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    }
    /**
     * Read a string starting from an open quotation mark
     * @returns none
     */
    string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            (0, _1.error)(this.line, "Unterminated string");
            return;
        }
        this.advance(); // the closing "
        // trim surrounding quotes
        let value = this.source.substring(this.start + 1, this.current - 1);
        this.addTokenLit(tokentype_1.TokenType.STRING, value);
    }
    isDigit(c) {
        return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0);
    }
    number() {
        while (this.isDigit(this.peek())) {
            this.advance();
        }
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek())) {
                this.advance();
            }
        }
        this.addTokenLit(tokentype_1.TokenType.NUMBER, Number(this.source.substring(this.start, this.current)));
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        let text = this.source.substring(this.start, this.current);
        let type = map.get(text);
        if (type == undefined)
            type = tokentype_1.TokenType.IDENTIFIER;
        this.addToken(type);
    }
    isAlpha(c) {
        let s = c.charCodeAt(0);
        return (s >= 'a'.charCodeAt(0) && s <= 'z'.charCodeAt(0)) ||
            (s >= 'A'.charCodeAt(0) && s <= 'Z'.charCodeAt(0)) || c == '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
}
exports.Scanner = Scanner;
