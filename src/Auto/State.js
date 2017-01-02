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
			this.trigger('run', this);
		}
		// check all transition associated with the current states
		var oState = this;
		this._trans.some(function(t) {
			if (t.pass(this)) {
				this.trigger('exit', this);
				oState = t.state();
				oState.trigger('enter', oState);
				return true;
			} else {
				return false;
			}
		}, this);
		return oState;
	},
	
	
	parse: function(oData, oEvents) {
		var sState, oState, oStates = {}, sTrans, oTrans, sTest;
		for (sState in oData) {
			oState = new O876.Auto.State();
			oState.name(sState);
			oStates[sState] = oState;
			if (oEvents && 'exit' in oEvents) {
				oState.on('exit', oEvents.exit);
			}
			if (oEvents && 'enter' in oEvents) {
				oState.on('enter', oEvents.enter);
			}
			if (oEvents && 'run' in oEvents) {
				oState.on('run', oEvents.run);
			}
			this.trigger('state', oState);		
		}
		for (sState in oData) {
			oState = oData[sState];
			for (sTrans in oState) {
				if (sTrans in oStates) {
					sTest = oState[sTrans];
					oTrans = new O876.Auto.Trans();
					if (oEvents && 'test' in oEvents) {
						oTrans.on('test', oEvents.test);
					}
					oTrans.test(sTest).state(oStates[sTrans]);
					oStates[sState].trans(oTrans);
					this.trigger('trans', oTrans);		
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
