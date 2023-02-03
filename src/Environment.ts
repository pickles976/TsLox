import { Token } from "./token"

export class Environment {
    static values: Map<string, any> = new Map()

    assign(name: Token, value: Object) {

        const key = name.lexeme.toString()
        if (Environment.values.has(key)) {
            Environment.values.set(key, value)
            return
        }

        throw new Error(`Undefined variable ${name.lexeme}`)
    }

    define(name: String, value: Object | null) {
        Environment.values.set(name.toString(), value)
    }

    get(name: Token) : Object | null {
        let key = name.lexeme.toString()
        if (Environment.values.has(key)) {
            return Environment.values.get(key)
        }

        throw new Error(`Undefined variable ${name.lexeme}`)
    }


}