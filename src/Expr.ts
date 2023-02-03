/**
 * Represents a Grammar structure
 */

import { Expression, Print } from './Stmt'
import { Token } from './token' 
export class Expr {
    accept(visitor: Visitor) : any { return "" } 
} 

export class Visitor { 
    constructor(){} 
    visitBinaryExpr(binary : Binary) : Object | null { return "" }
    visitGroupingExpr(grouping : Grouping) : Object { return "" }
    visitLiteralExpr(literal : Literal) : Object | null { return "" }
    visitUnaryExpr(unary : Unary) : Object | null { return "" }
    visitExpressionStmt(expression : Expression) : null { return null }
    visitPrintStmt(print : Print) : null { return null }
} 

export class Binary extends Expr { 
    left : Expr 
    operator : Token 
    right : Expr 
    constructor(left : Expr,operator : Token,right : Expr) { 
        super()
        this.left = left; 
        this.operator = operator; 
        this.right = right; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitBinaryExpr(this)
    } 

} 
 
export class Grouping extends Expr { 
    expression : Expr 
    constructor(expression : Expr) { 
        super()
        this.expression = expression; 
    } 

    accept(visitor: Visitor) : Object {
        return visitor.visitGroupingExpr(this)
    } 

} 
 
export class Literal extends Expr { 
    value : Object | null
    constructor(value : Object | null) { 
        super()
        this.value = value; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitLiteralExpr(this)
    } 

} 
 
export class Unary extends Expr { 
    operator : Token 
    right : Expr 
    constructor(operator : Token,right : Expr) { 
        super()
        this.operator = operator; 
        this.right = right; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitUnaryExpr(this)
    } 

} 
 
