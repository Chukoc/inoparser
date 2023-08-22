import { Lexer } from "../lexer";
import { Token, TokenType } from "../token";
import { astNode } from "./node";

export class Leaves extends astNode {
    private token : Token
    constructor(
        expectedTokenType : TokenType[],
        lexer : Lexer
    ){
        super(lexer)
        this.token = super.lexer.NextToken()
        if(expectedTokenType.find(element => element === this.token.getTokenType()) != undefined)
        {

        }
        else
        {
            // TODO Syntax error
        }
    }
}