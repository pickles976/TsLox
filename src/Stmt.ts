import { Expr, Visitor } from './Expr'
import { Token } from './token' 

export class Stmt {
    accept(visitor: Visitor) : any { return null } 
} 

export class Block extends Stmt { 
    statements : Stmt[] 
    constructor(statements : Stmt[]) { 
        super()
        this.statements = statements; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitBlockStmt(this)
    } 

} 

export class Expression extends Stmt { 
    expression : Expr 
    constructor(expression : Expr) { 
        super()
        this.expression = expression; 
    } 

    accept(visitor: Visitor) : null {
        return visitor.visitExpressionStmt(this)
    } 

} 
 
export class Print extends Stmt { 
    expression : Expr 
    constructor(expression : Expr) { 
        super()
        this.expression = expression; 
    } 

    accept(visitor: Visitor) : null {
        return visitor.visitPrintStmt(this)
    } 

} 

export class Var extends Stmt { 
    name : Token 
    initializer : Expr 
    constructor(name : Token,initializer : Expr) { 
        super()
        this.name = name; 
        this.initializer = initializer; 
    } 

    accept(visitor: Visitor) : null {
        return visitor.visitVarStmt(this)
    } 

} 
 
