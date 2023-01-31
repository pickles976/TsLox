import { Token } from './token' 
export class Expr {
    accept(visitor: Visitor) : String { return "" } 
} 

export class Visitor { 
    constructor(){} 
    visitBinaryExpr(binary : Binary) : String { return "" }
    visitGroupingExpr(grouping : Grouping) : String { return "" }
    visitLiteralExpr(literal : Literal) : String { return "" }
    visitUnaryExpr(unary : Unary) : String { return "" }
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

    accept(visitor: Visitor) : String {
        return visitor.visitBinaryExpr(this)
    } 

} 
 
export class Grouping extends Expr { 
    expression : Expr 
    constructor(expression : Expr) { 
        super()
        this.expression = expression; 
    } 

    accept(visitor: Visitor) : String {
        return visitor.visitGroupingExpr(this)
    } 

} 
 
export class Literal extends Expr { 
    value : Object 
    constructor(value : Object) { 
        super()
        this.value = value; 
    } 

    accept(visitor: Visitor) : String {
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

    accept(visitor: Visitor) : String {
        return visitor.visitUnaryExpr(this)
    } 

} 
 
