O2.createClass('O876.Shunyard.Operator', {
	_operators: null,
	
	__constuct: function() {
		this._operators = [];
	},
	
	/**
	 * Adds a new operator
	 * @param o plain object {token, precedence, associativity}
	 */
	_operator: function(o) {
		// check if operator already present
		var op = this._operators;
		if (op.filter(x => x.token === o.token).length) {
			throw new Error('shunyard : operator ' + o.token + ' is already defined');
		}
		// checks structure
		var aMissings = ['token', 'precedence', 'associativity'].filter(x => !(x in o));
		if (aMissings.length) {
			op.push(o); // add the new opérator
			op.sort((a, b) => a.precedence - b.precedence);
		} else {
			throw new Error('shunyard : operator format is invalid : missing [' + aMissings.join(', ') + ']');
		}
	}
});
