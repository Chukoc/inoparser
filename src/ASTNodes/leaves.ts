import { Lexer } from "../lexer";
import { Token, TokenType } from "../token";
import { astNode } from "./node";

export abstract class Leaves extends astNode {
    protected token : Token
    constructor(
        expectedTokenType : TokenType[],
        lexer : Lexer
    ){
        super(lexer)
        this.token = super.lexer.NextToken()
        if(expectedTokenType.find(element => element === this.token.getTokenType()) === undefined)
        {
            // TODO Syntax error
        }
    }

    toString() : string {
           return JSON.stringify
           (
            {
              Token: this.token.getTokenType(),
              Literal: this.token.getTokenLiteral(),
            }
           ) 
    }
}