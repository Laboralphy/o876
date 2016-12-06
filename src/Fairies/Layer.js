/**
 * Le layer doit etre rendu dans une surface, à une position données
 * */
 
 
O2.createClass('Fairy.Layer', {
	_origin: null, // vector origine du layer
	_view: null, // vecteur de début du rendu
	_width: 0,
	_height: 0,
	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._view = new Fairy.Vector();
	},
	
	render: function(oContext) {
	}
});

O2.mixin(Fairy.Layer, O876.Mixin.Prop);
