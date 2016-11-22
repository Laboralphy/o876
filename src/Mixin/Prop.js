(function(O2) {
	O2.createClass('O876.Mixin.Prop', {
		prop: function(sVariable, value) {
			if (value === undefined) {
				return this['_' + sVariable];
			} else {
				this['_' + sVariable] = value;
				return this;
			}
		}
	});
})(O2);

