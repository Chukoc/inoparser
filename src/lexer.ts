import { Token, TokenType, getKeyword } from "./token";

export class Lexer {
	private col : number
	private line : number

	private position : number
	private readPosition : number
	private ch : string

	static readonly EOF:0 = 0

	constructor(
		readonly input : string
	) {
		this.position = 0
		this.readPosition = 0
		this.col = 0
		this.line = 1
		this.ch = ''
		this.readChar()
	}

	readChar () {
		if (this.readPosition >= this.input.length)
		{
			this.ch = ''
		}
		else 
		{
			this.ch = this.input.charAt(this.readPosition)
		}

		this.position = this.readPosition
		this.readPosition += 1
		this.col += 1
	}

	peekChar() : number {
		if(this.readPosition >= this.input.length) 
		{
			return 0
		}
		else 
		{
			return this.getCharCode(this.input.charAt(this.readPosition))
		}
	}

	// Next Token: reutrn token
	public NextToken() : Token {
		let token : Token
		let pos : number
		this.skipWhiteSpace()
		switch (this.getReadingCharCode()) 
		{
			case Lexer.EOF:
				token = new Token(TokenType.EOF, '', this.line, this.col)
				break;
			
			case this.getCharCode('='):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.EQ, '==', this.line, pos)
						break
				
					default:
						token = new Token(TokenType.ASSIGN, '=', this.line, pos)
				}
				break

			case this.getCharCode('&'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('&'):
						this.readChar()
						token = new Token(TokenType.LOGAND, '&&', this.line, pos)
						break

					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.LOGAND, '&=', this.line, pos)
						break

					default :
						token = new Token(TokenType.BITAND, '&', this.line, pos)
				}
				break

			case this.getCharCode('|'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('|'):
						this.readChar()
						token = new Token(TokenType.LOGOR, '||', this.line, pos)
						break

					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.LOGOR, '|=', this.line, pos)
						break

					default :
						token = new Token(TokenType.BITOR, '|', this.line, pos)
				}
				break		
	
			case this.getCharCode('+'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('+'):
						this.readChar()
						token = new Token(TokenType.INC, '++', this.line, pos)
						break

					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.PULEQ, '+=', this.line, pos)
						break

					default :
						token = new Token(TokenType.PLUS, '+', this.line, pos)
				}
				break

			case this.getCharCode('-'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('-'):
						this.readChar()
						token = new Token(TokenType.DEC, '--', this.line, pos)
						break;
					
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.MINEQ, '-=', this.line, pos)
						break
					
					case this.getCharCode('>'):
						this.readChar()
						switch (this.peekChar()) 
						{
							case this.getCharCode('*'):
								this.readChar()
								token = new Token(TokenType.POINTARROW, '->*', this.line, pos)
								break
							default:
								token = new Token(TokenType.ARROW, '->', this.line, pos)
								break
						}
						break
					
					default:
						token = new Token(TokenType.MINUS, '-', this.line, pos)
				}
				break		

			case this.getCharCode('*') :
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.MULEQ, '*=', this.line, pos)
						break
					case this.getCharCode('/'):
						this.readChar()
						// TODO Treminate Comment
				
					default:
						token = new Token(TokenType.STAR, '*', this.line, pos)
				}
				break

			case this.getCharCode('/') :
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.DIVEQ, '/=', this.line, pos) 
						break
					case this.getCharCode('/'):
						this.readChar()
						this.skipALineComment()
						token = this.NextToken()
						return token
					case this.getCharCode('*'):
						this.readChar()
						this.skipLinesComment()
						token = this.NextToken()
						return token
					default:
						token = new Token(TokenType.SLASH, '/', this.line, pos)
				}
				break

			case this.getCharCode('!'):
				pos = this.col
				switch (this.peekChar())
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.NEQ, '!=', this.line, pos)
						break
					
					default:
						token = new Token(TokenType.LOGNOT, '!', this.line, pos)
				}
				break

			case this.getCharCode('%'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.MODEQ, '%=', this.line, pos)
						break

					default:
						token = new Token(TokenType.MOD, '%', this.line, pos)
				}
				break

			case this.getCharCode('^'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.XOREQ, '^=', this.line, pos)
						break
					
					default:
						token = new Token(TokenType.BITXOR, '^', this.line, pos)
				}
				break
			
			case this.getCharCode('<'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.LEQ, '<=', this.line, pos)
						break
					
					case this.getCharCode('<'):
						this.readChar()
						switch (this.peekChar()) 
						{
							case this.getCharCode('='):
								this.readChar()
								token = new Token(TokenType.LSHIFTEQ, '<<=', this.line, pos)
								break
						
							default:
								token = new Token(TokenType.LSHIFT, '<<', this.line, pos)
								break
						}
				
						break
					default:
						token = new Token(TokenType.LT, '<', this.line, pos)
				}
				break

			case this.getCharCode('>'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('='):
						this.readChar()
						token = new Token(TokenType.GEQ, '>=', this.line, pos)
						break
					
					case this.getCharCode('>'):
						this.readChar()
						switch (this.peekChar()) 
						{
							case this.getCharCode('='):
								this.readChar()
								token = new Token(TokenType.RSHIFTEQ, '>>=', this.line, pos)
								break
						
							default:
								token = new Token(TokenType.RSHIFT, '>>', this.line, pos)
								break
						}
						break
					default:
						token = new Token(TokenType.GT, '>', this.line, pos)
				}
				break

			case this.getCharCode('.'):
				pos = this.col
				switch (this.peekChar()) 
				{
					case this.getCharCode('*'):
						this.readChar()
						token = new Token(TokenType.POINTAPILIOD, '.*', this.line, pos)
						break;
					
					case this.getCharCode('.'):
						this.readChar()
						switch (this.peekChar()) 
						{
							case this.getCharCode('.'):
								this.readChar()
								token = new Token(TokenType.EXTENTION, '...', this.line, pos)
								break
						
							default:
									token  = new Token(TokenType.ILLEGAL, '..', this.line, pos)
						}
						break
				
					default:
						if(this.isNumber(this.peekChar()))
						{
							this.readChar()
							let lit = this.readIdentOrNumLiteral()
							const onlynum = /^([0-9]*'?)*[lfLF]?$/ 
							if(onlynum.test(lit))
							{
								token = new Token(TokenType.NUMBER, '.' + lit, this.line, pos)
							}
							else
							{
								token = new Token(TokenType.ILLEGAL, '.' + lit, this.line, pos)
							}
							return token
						}
						else
						{
							token = new Token(TokenType.PILIOD, '.', this.line, pos)
						}
				}
				break

			case this.getCharCode(':'):
				pos = this.col
				switch(this.peekChar())
				{
					case this.getCharCode(':'):
						this.readChar()
						token = new Token(TokenType.NAMERES, '::', this.line, pos)
						break
					default:
						token = new Token(TokenType.COLON, ':', this.line, pos)
				}
				break
			
			case this.getCharCode('?'):
				pos = this.col
				token = new Token(TokenType.QUESTION, '?', this.line, pos)
				break

			case this.getCharCode('~'):
				pos = this.col
				token = new Token(TokenType.BITNOT, '~', this.line, pos)
				break

			case this.getCharCode(','):
				pos = this.col
				token = new Token(TokenType.COMMA, ',', this.line, pos)
				break

			case this.getCharCode(';'):
				pos = this.col
				token = new Token(TokenType.SEMICOLON, ';', this.line, pos)
				break

			case this.getCharCode('('):
				pos = this.col
				token = new Token(TokenType.LPARLEN, '(', this.line, pos)
				break

			case this.getCharCode(')'):
				pos = this.col
				token = new Token(TokenType.RPARLEN, ')', this.line, pos)
				break

			case this.getCharCode('{'):
				pos = this.col
				token = new Token(TokenType.LBRAC, '{', this.line, pos)
				break

			case this.getCharCode('}'):
				pos = this.col
				token = new Token(TokenType.RBRAC, '}', this.line, pos)
				break

			case this.getCharCode('['):
				pos = this.col
				token = new Token(TokenType.LBRACKET, '[', this.line, pos)
				break

			case this.getCharCode(']'):
				pos = this.col
				token = new Token(TokenType.RBRACKET, ']', this.line, pos)
				break
			
			case this.getCharCode('"'):
				pos = this.col
				token = new Token(TokenType.STRING, this.readStringLiteral(), this.line, pos)
				break 

			case this.getCharCode("'"):
				pos = this.col
				let literal = this.readCharLiteral()
				token = new Token(this.getTypeOfNonKeyword(literal), literal, this.line, pos)
				break 

			default:
				pos = this.col
				if ( this.isNumber(this.getReadingCharCode()) || this.isAlphabet(this.getReadingCharCode()))
				{
					let literal = this.readIdentOrNumLiteral()
					token = new Token(this.getTypeOfNonKeyword(literal),literal,this.line, pos)
					return token
				}
				else
				{
					token = new Token(TokenType.ILLEGAL, this.input.charAt(this.position), this.line, pos)
					return token
				}
				
		}
		this.readChar()
		return token
	}

	readIdentOrNumLiteral() : string{
		let position = this.position
		while (this.isNumber(this.getReadingCharCode()) || this.isAlphabet(this.getReadingCharCode()))
		{
			this.readChar()
		}

		return this.input.substring(position, this.position)
	}

	readStringLiteral() : string {
		let position = this.position
		while (this.peekChar() != this.getCharCode('"') || this.getReadingCharCode() == this.getCharCode("\\"))
		{
			this.readChar()
		}
		this.readChar()

		return this.input.substring(position, this.position)
	}

	readCharLiteral() : string {
		let position = this.position
		while (this.peekChar() != this.getCharCode("'") || this.getReadingCharCode() == this.getCharCode("\\"))
		{
			this.readChar()
		}
		this.readChar()

		return this.input.substring(position, this.position)
	}

	getTypeOfNonKeyword(literal:string) : TokenType {
		const DIGITINT = /^[1-9]([0-9]*'?)*[uU]?[lL]?[lL]?$/
		const BININT = /^0[bB]([01]*'?)*[uU]?[lL]?[lL]?$/
		const OCTINT = /^0([0-7]*'?)*[uU]?[lL]?[lL]?$/
		const HEXINT = /^0[xX]([0-9a-fA-F]*'?)*[uU]?[lL]?[lL]?$/
		const FLOAT = /^[0-9]+\.([0-9]*'?)*([eE][\+-]?[0-9]*)?[lfLF]?$/
		const IDENT = /^[a-zA-Z_][a-zA-Z_0-9]*$/
		const CHAR = /^(L|u8|u|U)?'([^\\'"]|\\n|\\\\|\\t|\\\?|\\v|\'|\\d|\\"|\\r|\\0|\\f|\\a|\\[0-7]{3}|\\x[0-9a-fA-F]{1,8}|\\u[0-9]{4}|\\U[0-9]{8})'/
		const STRING = /^(u8|L|u|U)?R?".*"$/

		if (getKeyword(literal) != TokenType.IDENT)
		{
			return getKeyword(literal)
		}
		else if(
			DIGITINT.test(literal) ||
			BININT.test(literal) ||
			OCTINT.test(literal) ||
			HEXINT.test(literal) ||
			FLOAT.test(literal) 
		){
			return TokenType.NUMBER
		}
		else if (IDENT.test(literal))
		{
			return TokenType.IDENT
		}
		else if(CHAR.test(literal))
		{
			return TokenType.CHAR
		}
		else
		{
			return TokenType.ILLEGAL
		}

	}

	skipALineComment() {
		while (this.getReadingCharCode() != this.getCharCode('\n'))
		{
			this.readChar()
		}
		this.line++
		this.col = 0
		this.readChar()
	}

	skipLinesComment() {
		while (this.getReadingCharCode() != this.getCharCode('*') ||
			   this.peekChar() != this.getCharCode('/'))
		{
			this.readChar()

			if(this.getReadingCharCode() == this.getCharCode('\n'))
			{
				this.line++
				this.col = 0
			}
		}

		this.readChar()
		this.readChar()
	}

	skipWhiteSpace() {
		while (this.getReadingCharCode() == this.getCharCode(' ')  ||
			   this.getReadingCharCode() == this.getCharCode('\t') || 
			   this.getReadingCharCode() == this.getCharCode('\n') || 
			   this.getReadingCharCode() == this.getCharCode('\r') 
			   ) 
		{
			if (this.getReadingCharCode() == this.getCharCode('\n')) 
			{
				this.line++
				this.col = 0
			}

			this.readChar()
		}

	}

	// helper: return CharCode
	getCharCode(char:string): number {
		return char.charCodeAt(0)
	}

	getReadingCharCode(): number{
		if (this.ch.length == 0) 
		{
			return Lexer.EOF
		}
		else 
		{
			return this.ch.charCodeAt(0)
		}
	}

	// helper
	isAlphabet(charID:number): boolean {
		// let id = this.getCharCode(char)
		return this.getCharCode('a') <= charID && charID <= this.getCharCode('z') ||
			   this.getCharCode('A') <= charID && charID <= this.getCharCode('Z') || 
			   charID == this.getCharCode('_') || charID == this.getCharCode('"') || charID == this.getCharCode("'")
	}

	isNumber(charID:number):boolean{
		// let id = this.getCharCode(char)
		return this.getCharCode('0') <= charID && charID <= this.getCharCode('9')
	}
}