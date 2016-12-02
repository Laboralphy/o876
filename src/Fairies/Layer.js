/**
 * Le layer doit etre rendu dans une surface, à une position données
 * */
 
 
O2.createClass('Fairy.Layer', {
	
	_origin: null, // point de la grille qui sera affiché en haut à gauche du canvas
	_grid: null,
	_tileset: null,
	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._grid = new Fairy.Grid();
	},
	
		
	
	render: function(oContext) {
		var xOri = this.origin().x | 0;
		var yOri = this.origin().y | 0;
		
	}
	
});



O2.mixin(Fairy.Collider, O876.Mixin.Prop);
O2.mixin(Fairy.Collider, Fairy.GridContainer);
