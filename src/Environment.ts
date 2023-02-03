import { Token } from "./token"

export class Environment {
    
    values: Map<string, any> = new Map()
    enclosing: Environment | null

    constructor(enclosing?: Environment) {
        this.enclosing = enclosing ?? null
    }

    assign(name: Token, value: Object) {

        const key = name.lexeme.toString()
        if (this.values.has(key)) {
            this.values.set(key, value)
            return
        }

        if (this.enclosing != null) {
            this.enclosing.assign(name, value)
            return
        }

        throw new Error(`Undefined variable ${name.lexeme}`)
    }

    define(name: String, value: Object | null) {
        this.values.set(name.toString(), value)
    }

    get(name: Token) : Object | null {
        let key = name.lexeme.toString()
        if (this.values.has(key)) {
            return this.values.get(key)
        }

        if (this.enclosing != null) {
            return this.enclosing.get(name)
        }

        throw new Error(`Undefined variable ${name.lexeme}`)
    }


}