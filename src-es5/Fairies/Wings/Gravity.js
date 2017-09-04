O2.extendClass('Fairy.Wings.Gravity', Fairy.Wing, {

	_force: null,
	
	__construct: function() {
		__inherited();
		this._force = new Fairy.Vector();
	},

	flap: function(oMobile, nTime) {
		oMobile.flight().forces().push(this.force());
	}
});


O2.mixin(Fairy.Wings.Gravity, O876.Mixin.Prop);
