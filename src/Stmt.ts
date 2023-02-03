import { Expr, Visitor } from './Expr'
import { Token } from './token' 

export class Stmt {
    accept(visitor: Visitor) : null { return null } 
} 

// export class Visitor { 
//     constructor(){} 
//     visitExpressionStmt(expression : Expression) : String { return "" }
//     visitPrintStmt(print : Print) : String { return "" }
// } 

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
 
