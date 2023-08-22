import { Lexer } from "../lexer";
import { astNode } from "./node";

/*
  TODO 
  このクラスに "expectedNode" として当該Nodeのコンストラクタを持たせたい

  ex. 
  if-statement-node.expectedNode = [
    new ifLiteralNode()
    new lParlenLiteralNode()
    new conditionNode()
    new rParlenLiteralNode()
    new lBracketLiteralNode()
    new statementNode
  ]
*/

export abstract class Inner extends astNode {
    protected children : astNode[] = []
    protected nodeName : string
    constructor(
        nodeName : string, 
        lexer : Lexer, 
    ){
        super(lexer)
        this.nodeName = nodeName
    }
}