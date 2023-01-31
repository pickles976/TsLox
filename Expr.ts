import { Token } from './src/token' 
class Expr {} 

class Visitor { 
    constructor(){} 
    visitBinaryExpr(binary : Binary){}
    visitGroupingExpr(grouping : Grouping){}
    visitLiteralExpr(literal : Literal){}
    visitUnaryExpr(unary : Unary){}
} 

class Binary extends Expr { 
    left : Expr 
    operator : Token 
    right : Expr 
    constructor(left : Expr,operator : Token,right : Expr) { 
        super()
        this.left = left; 
        this.operator = operator; 
        this.right = right; 
    } 

    accept(visitor: Visitor) {
        return visitor.visitBinaryExpr(this)
    } 

} 
 
class Grouping extends Expr { 
    expression : Expr 
    constructor(expression : Expr) { 
        super()
        this.expression = expression; 
    } 

    accept(visitor: Visitor) {
        return visitor.visitGroupingExpr(this)
    } 

} 
 
class Literal extends Expr { 
    value : Object 
    constructor(value : Object) { 
        super()
        this.value = value; 
    } 

    accept(visitor: Visitor) {
        return visitor.visitLiteralExpr(this)
    } 

} 
 
class Unary extends Expr { 
    operator : Token 
    right : Expr 
    constructor(operator : Token,right : Expr) { 
        super()
        this.operator = operator; 
        this.right = right; 
    } 

    accept(visitor: Visitor) {
        return visitor.visitUnaryExpr(this)
    } 

} 
 
