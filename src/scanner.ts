import { error } from "."
import { Token } from "./token"
import { TokenType } from "./tokentype"

let keywords = {

    "and" : TokenType.AND,

}

export class Scanner {

    source: String
    tokens: Token[] = []

    start: number = 0
    current: number = 0
    line: number = 1

    constructor(source: String) {
        this.source = source
    }

    scanTokens() : Token[] {
        while(!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }

        this.tokens.push(new Token(TokenType.EOF, "", {}, this.line))
        return this.tokens
    }

    isAtEnd() {
        return this.current >= this.source.length
    }

    scanToken() {   
        let c: String = this.advance()

        switch(c) {

            // single char tokens
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.RIGHT_BRACE); break;
            case '}': this.addToken(TokenType.LEFT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break;

            // compound operators
            case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG); break;
            case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL); break;
            case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS); break;
            case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER); break;

            // division or comments
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) { this.advance() }
                } else {
                    this.addToken(TokenType.SLASH)
                }
                break

            // whitespace
            case ' ':
            case '\r':
            case '\t':
                break

            case '\n':
                this.line++
                break

            // string literals
            case '"': this.string(); break;
            
            // num literals + unexpected chars
            default: 
                if (this.isDigit(c)) {
                    this.number()
                } else if (this.isAlpha(c)) {
                    this.identifier()
                } else {
                    error(this.line, "Unexpected character")
                }
                break;

        }

    }

    advance() : String {
        return this.source.charAt(this.current++)
    }

    addToken(type: TokenType) {
        this.addTokenLit(type, {})
    }

    addTokenLit(type: TokenType, literal: Object) {
        let text : String = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }

    match(expected: String) : boolean {
        if (this.isAtEnd()) return false
        if (this.source.charAt(this.current) != expected) return false

        this.current++
        return true
    }

    peek() : String {
        if (this.isAtEnd()) return '\0'
        return this.source.charAt(this.current)
    }

    /**
     * Read a string starting from an open quotation mark
     * @returns none
     */
    string() {
        while(this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() =='\n') this.line++
            this.advance()
        }

        if (this.isAtEnd()) {
            error(this.line, "Unterminated string")
            return
        }

        this.advance() // the closing "

        // trim surrounding quotes
        let value: String = this.source.substring(this.start + 1, this.current - 1)
        this.addTokenLit(TokenType.STRING, value)
    }

    isDigit(c : String) : boolean {
        return c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0)
    }

    number() {
        while(this.isDigit(this.peek())) {
            this.advance()
        }
        
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance()

            while(this.isDigit(this.peek())) { this.advance()}
        }

        this.addTokenLit(TokenType.NUMBER, Number(this.source.substring(this.start, this.current)))

    }

    peekNext() : String {
        if (this.current + 1 >= this.source.length) return '\0'
        return this.source.charAt(this.current + 1)
    }

    identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance()
        this.addToken(TokenType.IDENTIFIER)
    }

    isAlpha(c : String) : boolean {
        let s = c.charCodeAt(0)
        return (s >= 'a'.charCodeAt(0) && s <= 'z'.charCodeAt(0)) ||
        (s >= 'A'.charCodeAt(0) && s <= 'Z'.charCodeAt(0)) || c == '_'
    }

    isAlphaNumeric(c: String) : boolean {
        return this.isAlpha(c) || this.isDigit(c)
    }

}