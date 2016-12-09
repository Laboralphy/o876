/**
 * Ce layer gère une collection de mobiles
 * 
 */
 
O2.extendClass('Fairy.MobileLayer', Fairy.Layer, {
	
	_mobiles: null,
	_collider: null,
	_sorted: true,
	_visibleMobiles: null,
	
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

	/**
	 * Tri les mobiles selon s'ils sont dans le view ou non
	 * Pour les mobiles visible, ont les tri par position y
	 * @param nTime interval de temps...
	 */
	process: function(nTime) {
		var view = this.view();
		this.visibleMobiles(
			this.mobiles().filter(m => this.view().hits(m.shape()))
		).visibleMobiles().sort(this._sort);
		return this;
	},
	
	/**
	 * Affiche les mobiles visibles
	 * @param oContext context 2D de rendu
	 */
	render: function(oContext) {
		var vRender = Fairy.Vector.ZERO.sub(this.origin().add(this.view().offset()));
		this.visibleMobiles().forEach(m => m.render(oContext, vRender));
		return this;
	}
});

O2.mixin(Fairy.MobileLayer, O876.Mixin.Prop);
