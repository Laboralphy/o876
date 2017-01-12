/**
 * WorldLayer est capable de gérer une infinité de portion de terrain
 * Seules les portions a l'interieur de la zone de vue sont affichée.
 * lors de la phase de rendu, le WorldPlayer génère des évènements
 * indiquant les coordonnées des portions qu'il souhaite afficher
 * C'est à l'appli, en réponse à ces évènements, de fournir les portions
 * sous forme d'un canvas ou d'une image.
 */ 
O2.extendClass('Fairy.WorldLayer', Fairy.Layer, {
	_view: null, // vector de vue Rect
	_zoneWidth : 0,
	_zoneHeight : 0,
	_zones: null,
	_moreZones: false,  // a true ce flag permet de gérer également les zone
		// adjacentes aux zones qui sont partiellement visible dans la vue
		// utile pour permettre au système d'eventuellement précharger les zones
		// si la conception des zone dépend d'un résultat ajax ou d'un Worker.


	__construct: function() {
		this._view = new Fairy.View();
		this._zones = {};
	},
	
	/**
	 * Calcule la liste des zones balayées par la vue
	 * Renvoi des évèbnements
	 * zone.(a|d|n) {
	 *	x, coordonnée x de la portion
	 *	y, coordonnée y de la portion
	 *	key, clé d'identification de la portion
	 * 	canvas: canvas/image qu'il faudra fournir en retour
	 * }
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
		if (this.moreZones()) {
			--xs;
			--ys;
			++xe;
			++ye;
		}
		var sKey, oNow = {};
		var oPrev = this.zones();
		var a = {
			d: [], // zone à décharger (ne sert plus car sort de la zone de vue)
			n: [], // nouvelle zone à charger, vien d'apparaitre dans la vue
			a: [] // zone toucjourr affichée
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
	
	/**
	 * Rendu du layer
	 */
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

O2.mixin(Fairy.WorldLayer, O876.Mixin.Prop);
O2.mixin(Fairy.WorldLayer, O876.Mixin.Events);
