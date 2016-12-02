O2.extendClass('Fairy.Wings.Shock', Fairy.Wing, {

	_shock: null,
	
	__construct: function() {
		__inherited();
	},
	

	flap: function(oMobile, nTime) {
		var f = oMobile.flight();
		if (this.shock()) {
			f.forces().push(this.shock().clone());
			this.shock(null);
		}
	}
});


O2.mixin(Fairy.Wings.Shock, O876.Mixin.Prop);
