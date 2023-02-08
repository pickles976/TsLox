import { stringify } from "querystring";
import { Visitor, Literal, Grouping, Expr, Unary, Binary, Variable, Assign, Logical } from "./Expr";
import { Token } from "./token";
import { TokenType } from "./tokentype";
import { Block, Expression, If, Print, Stmt, Var, While } from "./Stmt";
import { Environment } from "./Environment";

export class Interpreter extends Visitor {

    environment : Environment = new Environment()

    constructor(){
        super()
    }

    interpret(statements: Stmt[]) {
        try {
            statements.forEach((statement) => {
                this.execute(statement)
            })
        } catch (err) {
            console.error(err)
        }
    }

    execute(stmt: Stmt) {
        stmt.accept(this)
    }

    stringify(object: Object | null) : String {
        if (object == null) return "nil"
        if (typeof object == "number") {
            let text: String = object.toString()
            if (text.endsWith(".0")) {
                text = text.substring(0, text.length - 2)
            }
            return text
        }
        return object.toString()
    }

    visitAssignExpr(expr: Assign): Object | null {
        let value: Object = this.evaluate(expr.value)
        this.environment.assign(expr.name, value)
        return value
    }

    visitLiteralExpr(expr: Literal) : Object | null {
        return expr.value
    }

    visitLogicalExpr(expr: Logical): Object | null {
        let left : Object = this.evaluate(expr.left)
        if (expr.operator.type == TokenType.OR) {
            if (this.isTruthy(left)) return left
        } else {
            if (!this.isTruthy(left)) return left
        }
        return this.evaluate(expr.right)
    }

    visitGroupingExpr(expr: Grouping): Object {
        return this.evaluate(expr.expression)
    }

    visitUnaryExpr(expr: Unary): Object | null {
        let right: Object = this.evaluate(expr.right)

        switch(expr.operator.type) {
            case TokenType.BANG:
                return !this.isTruthy(right)
            case TokenType.MINUS: 
                return -(+right)
        }

        return null
    }

    visitVariableExpr(expr: Variable): Object | null {
        return this.environment.get(expr.name)
    }

    visitBinaryExpr(expr: Binary): Object | null {
        let left : Object = this.evaluate(expr.left)
        let right : Object = this.evaluate(expr.right)

        switch(expr.operator.type) {
            case TokenType.GREATER:
                return +left > +right
            case TokenType.GREATER_EQUAL:
                return +left >= +right
            case TokenType.LESS:
                return +left < +right
            case TokenType.LESS_EQUAL:
                return +left <= +right
            case TokenType.MINUS:
                return +left - +right
            case TokenType.BANG_EQUAL:
                return !this.isEqual(left, right)
            case TokenType.EQUAL_EQUAL:
                return this.isEqual(left, right)
            case TokenType.PLUS:
                if (typeof left == "number" && typeof right == "number") {
                    return left + right
                }

                if (typeof left == "string" && typeof right == "string") {
                    return left + right
                }
                break;
            case TokenType.SLASH:
                return +left / +right
            case TokenType.STAR:
                return +left * +right
        }

        return null
    }

    visitExpressionStmt(expr: Expression): null {
        this.evaluate(expr.expression)
        return null
    }

    visitIfStmt(stmt: If): Object | null {
        // console.log(this.isTruthy(this.evaluate(stmt.condition)))
        if (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.thenBranch)
        } else if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch)
        }
        return null
    }

    visitPrintStmt(print: Print): null {
        let val = this.evaluate(print.expression)
        console.log(this.stringify(val))
        return null
    }

    visitVarStmt(stmt: Var): null {
        let value = null
        if(stmt.initializer != null) {
            value = this.evaluate(stmt.initializer)
        } 
        this.environment.define(stmt.name.lexeme, value)
        return null
    }

    visitWhileStmt(stmt: While): Object | null {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body)
        }
        return null
    }

    visitBlockStmt(stmt: Block): Object | null {
        this.executeBlock(stmt.statements, new Environment(this.environment))
        return null
    }

    executeBlock(statments: Stmt[], environment: Environment) {
        let previous = this.environment
        try {
            this.environment = environment
            statments.forEach((statement) => {
                this.execute(statement)
            })
        } finally {
            this.environment = previous
        }
    }

    evaluate(expr: Expr) : Object {
        return expr.accept(this)
    }

    isTruthy(object: Object) : boolean {
        if (object == null) return false
        if (typeof object === "boolean") return Boolean(object)
        return true
    }

    isEqual(a: Object, b: Object) : boolean {
        if (a==null && b==null) return true
        if (a == null) return false
        return a === b
    }

}