/**
 * Le layer doit etre rendu dans une surface, à une position données
 * */
 
 
O2.extendClass('Fairy.LandLayer', Fairy.Layer, {
	
	_grid: null,
	_tileset: null,
	_view: null, // vector de vue Rect
	
	
	__construct: function() {
		__inherited();
		this._grid = new Fairy.Grid();
	},

	render: function(oContext) {
		var p = this.view().points();
		var tw = this._tileset.tileWidth();
		var th = this._tileset.tileHeight();
		
		var xStart = p[0].x / tw | 0;
		var yStart = p[0].y / th | 0;
		
		var x, y;
		
		
		
		
		
		return this;
	}

});

O2.mixin(Fairy.Collider, O876.Mixin.Prop);
O2.mixin(Fairy.Collider, Fairy.GridProxy);
