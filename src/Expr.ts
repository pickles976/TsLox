/**
 * Represents a Grammar structure
 */

import { Block, Expression, If, Print, Var, While } from './Stmt'
import { Token } from './token' 
export class Expr {
    accept(visitor: Visitor) : any { return "" } 
} 

export class Visitor { 
    constructor(){} 
    visitBlockStmt(block : Block) : Object | null { return null }
    visitAssignExpr(assign: Assign) : Object | null { return "" }
    visitBinaryExpr(binary : Binary) : Object | null { return "" }
    visitGroupingExpr(grouping : Grouping) : Object { return "" }
    visitLiteralExpr(literal : Literal) : Object | null { return "" }
    visitLogicalExpr(logical : Logical) : Object | null { return "" }
    visitUnaryExpr(unary : Unary) : Object | null { return "" }
    visitExpressionStmt(expression : Expression) : null { return null }
    visitIfStmt(i : If) : Object | null { return "" }
    visitPrintStmt(print : Print) : null { return null }
    visitWhileStmt(whl : While) : Object | null { return "" }
    visitVarStmt(variable : Var) : null { return null }
    visitVariableExpr(variable : Variable) : Object | null { return "" }
} 

export class Assign extends Expr { 
    name : Token 
    value : Expr 
    constructor(name : Token,value : Expr) { 
        super()
        this.name = name; 
        this.value = value; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitAssignExpr(this)
    } 

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

export class Logical extends Expr { 
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
        return visitor.visitLogicalExpr(this)
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
 
export class Variable extends Expr { 
    name : Token 
    constructor(name : Token) { 
        super()
        this.name = name; 
    } 

    accept(visitor: Visitor) : Object | null {
        return visitor.visitVariableExpr(this)
    } 

} 
 
