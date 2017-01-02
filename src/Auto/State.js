O2.createClass('O876.Auto.State', {

	_name: '',
	_trans: null,
	
	__construct: function() {
		this._trans = [];
	},
	
	/**
	 * Adds a new transition
	 */
	trans: function(t) {
		if (t !== undefined) {
			this._trans.push(t);
			return this;
		} else {
			return this._trans;
		}
	},

	process: function() {
		// runs the states
		if (this.name()) {
			this.trigger('run', this.name());
		}
		// check all transition associated with the current states
		this._trans.some(function(t) {
			if (t.pass(this)) {
				this.trigger('exit', this.name());
				t.state().trigger('enter', t.state().name());
				return true;
			} else {
				return false;
			}
		}, this);
	},
	
	
	parse: function(oData) {
		var sState, oState, oStates = {}, sTrans, oTrans, sTest;
		for (sState in oData) {
			oState = new O876.Auto.State();
			oState.name(sState);
			oStates[sState] = oState;			
		}
		for (sState in oData) {
			oState = oData[sState];
			for (sTrans in oState) {
				if (sTrans in oStates) {
					sTest = oState[sTrans];
					oTrans = new O876.Auto.Trans();
					oTrans.test(sTest).state(sTrans);
					oStates[sState].trans(oTrans);
				} else {
					throw new Error('unknown next-state "' + sTrans + '" in state "' + sState + '"');
				}
			}
		}
		return oStates;
	}
});

O2.mixin(O876.Auto.State, O876.Mixin.Prop);
O2.mixin(O876.Auto.State, O876.Mixin.Events);
