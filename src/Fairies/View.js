/**
 * @class Fairy.View
 * @extends Fairy.Rect
 *
 * Une vue est une zone rectangulaire correspondant généralement à un écran.
 * La vue dispose d'une propriété flight permettant de tracker un mobile
 * La vue dispose également d'une position-écran virtuelle pour positionner l'objet tracké
 */
 
O2.extendClass('Fairy.View', Fairy.Rect, {
	_offset: null,	// Vecteur position du flight dans le contexte de la vue.
	_width: 0,		// taille de la vue
	_height: 0,
	
	__construct: function() {
		__inherited();
		this.flight(new Fairy.Flight());
		this.offset(new Fairy.Vector());
		this.p1(new Fairy.Vector(0, 0));
		this.p2(new Fairy.Vector(0, 0));
	},
	
	points: function() {
		// retirer screen
		this._p2.x = this._width; 
		this._p2.y = this._height; 
		return __inherited().map(v => v.sub(this._offset));
	},
	
	center: function() {
		this.offset(new Fairy.Vector(this.width() >> 1, this.height() >> 1));
	},
});

O2.mixin(Fairy.View, O876.Mixin.Prop);
