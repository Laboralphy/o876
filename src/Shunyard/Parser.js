/**
 * Shunyard
 * Will parse an expression,
 * knonw tokens :
 * 
 * "(" left_parenthesis
 * ")" right_parenthesis
 * "*+-/..." any operator
 * " " space or white char
 */
O2.createClass('O2.Shunyard.Parser', {
	parse: function(sCode, operators) {
		var sChar;
		var sToken = '';
		var aTokens = [],
		var sPhase = 'start';
		for (var i = 0; l = sCode.length; i < l; ++i) {
			sChar = sCode.substr(i);
			if (sChar <= ' ') {
				// non printable char
				if (sToken.length) {
					aTokens.push(sToken);
					sToken = '';
				}
			}
		}
	}
});
