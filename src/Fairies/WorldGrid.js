O2.createClass('Fairy.WorldGrid',	{
	_view: null, // vector de vue Rect
	_zoneWidth : 0,
	_zoneHeight : 0,
	_zones: null,


	__construct: function() {
		this._view = new Fairy.View();
		this._zones = {};
	},
	
	/**
	 * Renvoie la liste des cellule balayées par la vue
	 */
	update: function() {
		var a = [];
		var p = this.view().points();
		var cw = this.zoneWidth();
		var ch = this.zoneHeight();
		var xs = p[0].x / cw | 0;
		var ys = p[0].y / ch | 0;
		var xe = p[1].x / cw | 0;
		var ye = p[1].y / ch | 0;
		var sKey, oNow = {};
		var oPrev = this.zones();
		var a = {
			d: [],
			n: [],
			a: []
		};
		
		for (var x, y = ys; y <= ye; ++y) {
			for (x = xs; x <= xe; ++x) {
				sKey = x.toString() + ':' + y.toString();
				oNow[sKey] = [x, y];
				if (oPrev[sKey]) {
					// pas de changement
					a.a.push(oNow[sKey]);
					delete oPrev[sKey];
				} else {
					// ajout
					a.n.push(oNow[sKey]);
				}
			}
		}
		for (sKey in oPrev) {
			a.d.push(oPrev[sKey]);
		}
		this.zones(oNow);
		for (var s in a) {
			a[s].forEach(xy => this.trigger('zone', {op: s, x: xy[0], y: xy[1]}) );
		}
		return this;
	},
	
	render: function() {
		var vc = this.zones();
		for (var c in vc) {
			//this.
		}
	}
});

O2.mixin(Fairy.WorldGrid, O876.Mixin.Prop);
O2.mixin(Fairy.WorldGrid, O876.Mixin.Events);
