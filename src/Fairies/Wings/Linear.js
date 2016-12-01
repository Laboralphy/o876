O2.extendClass('Fairy.Wings.Linear', Fairy.Wing, {

	_speed: null,
	
	__construct: function() {
		__inherited();
		this._speed = new Fairy.Vector();
	},

	flap: function(oMobile, nTime) {
		oMobile.flight().move(this.speed());
	}
});


O2.mixin(Fairy.Wings.Linear, O876.Mixin.Prop);
