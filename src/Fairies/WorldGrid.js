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
	 * Calcule la liste des cellule balayées par la vue
	 */
	update: function() {
		var a = [];
		var p = this.view().points();
		var cw = this.zoneWidth();
		var ch = this.zoneHeight();
		var vx = p[0].x;
		var vy = p[0].y;
		var xs = Math.floor(vx / cw);
		var ys = Math.floor(vy / ch);
		var xe = Math.floor(p[1].x / cw);
		var ye = Math.floor(p[1].y / ch);
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
				if (oPrev[sKey]) {
					a.a.push(sKey);
					oNow[sKey] = oPrev[sKey];
					delete oPrev[sKey];
				} else {
					// ajout
					oNow[sKey] = {
						x: x, 
						y: y, 
						key: sKey, 
						canvas: null
					};
					a.n.push(sKey);
				}
			}
		}
		for (sKey in oPrev) {
			a.d.push(sKey);
		}
		this.zones(oNow);
		for (var s in a) {
			a[s].forEach((function(key) {
				this.trigger('zone.' + s, oNow[key]);
			}).bind(this));
		}
		return this;
	},
	
	render: function(oContext) {
		var zc;
		var z = this.zones();
		var p = this.view().points();
		var cw = this.zoneWidth();
		var ch = this.zoneHeight();
		var vx = p[0].x;
		var vy = p[0].y;
		for (var c in z) {
			zc = z[c];
			if (zc.canvas) {
				oContext.drawImage(zc.canvas, zc.x * cw - vx, zc.y * cw - vy);
			}
		}
	}
});

O2.mixin(Fairy.WorldGrid, O876.Mixin.Prop);
O2.mixin(Fairy.WorldGrid, O876.Mixin.Events);
