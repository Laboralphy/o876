/**
 * @class Fairy.Layer
 *
 * Un layer est une surface de rendu
 * Il dispose d'un vecteur "origin" : position du coin supérieur gauche du layer
 * par rapport au référentiel absolu
 * un fenetre View rectangulaire permet de déterminer les entité qui seront affichée
 */
 
 
O2.createClass('Fairy.Layer', {
	_origin: null, // vector origine du layer
	_view: null, // vecteur de début du rendu
	_width: 0,
	_height: 0,
	
	__construct: function() {
		this._origin = new Fairy.Vector();
		this._view = new Fairy.View();
	},
	
	render: function(oContext) {
	}
});

O2.mixin(Fairy.Layer, O876.Mixin.Prop);
