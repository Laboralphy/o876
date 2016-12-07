/**
 * Le layer doit etre rendu dans une surface, à une position donnée
 */
 
 
O2.extendClass('Fairy.MobileLayer', Fairy.Layer, {
	
	_mobiles: null,
	_collider: null,
	
	__construct: function() {
		__inherited();
		this._mobiles = [];
		this._collider = new Fairy.Collider();
	},
	
	/**
	 * Fonction de tri utilisée en callback par mobiles.sort
	 * @param a Fairy.Mobile
	 * @param b Fairy.Mobile
	 * @return int résultat exploitable par la fonction Array.sort
	 */
	_sort: function(a, b) {
		return a.flight().position().y - b.flight().position().y;
	},
	
	/**
	 * Défini le call back pour la fonction de tri des mobile
	 * @param f fonction compatible avec Array.sort
	 */
	sort: function(f) {
		this._sort = f;
		return this;
	},
	
	process: function(nTime) {
		this._mobiles.sort(this._sort);
		return this;
	},
	
	render: function(oContext) {
		var vRender = Fairy.Vector.ZERO.sub(this.origin().add(this.view()));
		this._mobiles.forEach(m => m.render(oContext, vRender));
		return this;
	}
});

O2.mixin(Fairy.MobileLayer, O876.Mixin.Prop);
