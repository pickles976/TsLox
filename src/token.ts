import { TokenType } from "./tokentype"

export class Token {

    type: TokenType
    lexeme: String
    literal: Object
    line: number

    constructor(type: TokenType, lexeme: String, literal: Object, line: number) {
        this.type = type
        this.lexeme = lexeme
        this.literal = literal
        this.line = line
    }

    toString() : String {
        return `${this.type} ${this.lexeme} ${this.literal}`
    }
}