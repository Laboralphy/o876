/**
 * Le layer doit etre rendu dans une surface, à une position données
 * */
 
 
O2.extendClass('Fairy.LandLayer', Fairy.Layer, {
	
	_grid: null,
	
	__construct: function() {
		__inherited();
		this._grid = new Fairy.Grid();
	},

	render: function(oContext) {
		
		return this;
	}

});

O2.mixin(Fairy.Collider, O876.Mixin.Prop);
O2.mixin(Fairy.Collider, Fairy.GridProxy);
