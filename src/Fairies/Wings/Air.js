/**
 * Air resistance
 */

O2.extendClass('Fairy.Wings.Air', Fairy.Wing, {

	_factor: 1,
	
	__construct: function() {
		__inherited();
	},

	flap: function(oMobile, nTime) {
		oMobile.flight().speed().scale(this.factor());
	}
});


O2.mixin(Fairy.Wings.Air, O876.Mixin.Prop);
