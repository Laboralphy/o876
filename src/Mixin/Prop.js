/**
 * good to GIT
 * Provide jquery like function to access private properties
 */
O2.createClass('O876.Mixin.Prop', {

	buildPropFunction: function(sProp) {
		return function(value) {
			if (value === undefined) {
				return this[sProp];
			} else {
				this[sProp] = value;
				return this;
			}
		}
	},

	mixin: function(p) {
		var pProto = {
		};
		for (var i in p.prototype) {
			if (i.match(/^_/)) {
				if (typeof p.prototype[i] !== 'function') {
					pProto[i.substr(1)] = this.buildPropFunction(i);
				}
			}
		}

		p.extendPrototype(pProto);
	}
});
