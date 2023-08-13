import {Lexer} from "../src/lexer"
import {Token, TokenType} from "../src/token"

let lexer = new Lexer(
`i = 1;
void loop() {
	// do something
	i/*test*/ += 1;
	print(i);
}
	`
);

const expectedTokenForLexer:Token[] = [
	new Token(TokenType.IDENT, 'i', 1, 1),
	new Token(TokenType.ASSIGN, '=', 1, 3),
	new Token(TokenType.NUMBER, '1', 1, 5),
	new Token(TokenType.SEMICOLON, ';', 1, 6),
	new Token(TokenType.VOID, 'void', 2, 1),
	new Token(TokenType.IDENT, 'loop', 2, 6),
	new Token(TokenType.LPARLEN, '(', 2, 10),
	new Token(TokenType.RPARLEN, ')', 2, 11),
	new Token(TokenType.LBRAC, '{', 2, 13),
	new Token(TokenType.IDENT, 'i', 4, 2),
	new Token(TokenType.PULEQ, '+=', 4, 12),
	new Token(TokenType.NUMBER, '1', 4, 15),
	new Token(TokenType.SEMICOLON, ';', 4, 16),
	new Token(TokenType.IDENT,'print',5,2),
	new Token(TokenType.LPARLEN, '(', 5, 7),
	new Token(TokenType.IDENT, 'i', 5, 8),
	new Token(TokenType.RPARLEN, ')', 5, 9),
	new Token(TokenType.SEMICOLON, ';', 5, 10),
	new Token(TokenType.RBRAC, '}', 6, 1)
]

describe('lexer test: ', () => {
	test('Normal Test', () => {
		expectedTokenForLexer.forEach(element => {
			expect(lexer.NextToken()).toStrictEqual(element)
			// console.log(lexer.NextToken())
		})
	})
})