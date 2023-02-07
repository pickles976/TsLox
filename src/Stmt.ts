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

export class If extends Stmt { 
    condition : Expr 
    thenBranch : Stmt 
    elseBranch : Stmt  | null
    constructor(condition : Expr,thenBranch : Stmt,elseBranch : Stmt | null) { 
        super()
        this.condition = condition; 
        this.thenBranch = thenBranch; 
        this.elseBranch = elseBranch; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitIfStmt(this)
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

export class While extends Stmt { 
    condition : Expr 
    body : Stmt 
    constructor(condition : Expr,body : Stmt) { 
        super()
        this.condition = condition; 
        this.body = body; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitWhileStmt(this)
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
 
