O2.extendClass('Fairy.Wings.BumpFloor', Fairy.Wing, {

	_bottom: 0,
	
	__construct: function() {
		__inherited();
	},

	flap: function(oMobile, nTime) {
		var f = oMobile.flight();
		if (f.position().y > this._bottom) {
			f.position().y = this._bottom;
			f.speed().y *= -0.80;
		}
	}
});


O2.mixin(Fairy.Wings.BumpFloor, O876.Mixin.Prop);
