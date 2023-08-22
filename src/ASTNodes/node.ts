import { Lexer } from "../lexer"

export abstract class astNode {
    protected lexer : Lexer
    constructor(
        lexer : Lexer
    ){
        this.lexer = lexer
    }
}