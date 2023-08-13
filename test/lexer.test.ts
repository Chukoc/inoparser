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

let numLiteralLexer = new Lexer(
	`unsigned long long _i = 0b0010;
_i-=0B0011;
_i*=023'47;
_i/=0x11Ab;
/* test for 
multi lines comment*/
_i == .01236f;
i12 <= 123456789123ull;`
)

const expectedTokenFornumLiteral : Token[] = [
	new Token(TokenType.UNSIGNED, 'unsigned', 1, 1),
	new Token(TokenType.LONG, 'long', 1, 10),
	new Token(TokenType.LONG, 'long', 1, 15),
	new Token(TokenType.IDENT, '_i', 1, 20),
	new Token(TokenType.ASSIGN, '=', 1, 23),
	new Token(TokenType.NUMBER, '0b0010', 1, 25),
	new Token(TokenType.SEMICOLON, ';', 1, 31),
	new Token(TokenType.IDENT, '_i', 2, 1),
	new Token(TokenType.MINEQ, "-=", 2,3),
	new Token(TokenType.NUMBER, "0B0011", 2,5),
	new Token(TokenType.SEMICOLON, ';', 2, 11),
	new Token(TokenType.IDENT, '_i', 3, 1),
	new Token(TokenType.MULEQ, "*=", 3,3),
	new Token(TokenType.NUMBER, "023'47", 3, 5),
	new Token(TokenType.SEMICOLON, ';', 3, 11),
	new Token(TokenType.IDENT, '_i', 4, 1),
	new Token(TokenType.DIVEQ, "/=", 4,3),
	new Token(TokenType.NUMBER, '0x11Ab', 4, 5),
	new Token(TokenType.SEMICOLON, ';', 4, 11),
	new Token(TokenType.IDENT, '_i', 7, 1),
	new Token(TokenType.EQ, '==', 7, 4),
	new Token(TokenType.NUMBER, '.01236f',7, 7),
	new Token(TokenType.SEMICOLON, ';', 7, 14),
	new Token(TokenType.IDENT, 'i12', 8, 1),
	new Token(TokenType.LEQ, '<=', 8, 5),
	new Token(TokenType.NUMBER, '123456789123ull',8, 8),
	new Token(TokenType.SEMICOLON, ';', 8, 23),
]

describe('lexer test:', () => {
	test('Literal test', () => {
		expectedTokenFornumLiteral.forEach(element => {
			expect(numLiteralLexer.NextToken()).toStrictEqual(element)
		})
	})
} )

let longOperatorLexer = new Lexer(
	`<<=
>>=
...
->*`
)

const expectedTokenForLongOperator : Token[] = [
	new Token(TokenType.LSHIFTEQ, '<<=', 1, 1),
	new Token(TokenType.RSHIFTEQ, '>>=', 2, 1),
	new Token(TokenType.EXTENTION, '...', 3, 1),
	new Token(TokenType.POINTARROW, '->*', 4, 1),
]

describe('lexer test', () => {
	test('Long operator test', ()=>{
		expectedTokenForLongOperator.forEach(element => {
			expect(longOperatorLexer.NextToken()).toStrictEqual(element)
		})
	})
})
