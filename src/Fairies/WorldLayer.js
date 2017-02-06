/**
 * @class Fairy.WorldLayer
 * WorldLayer est capable de gérer une infinité de portion de terrain
 * Seules les portions a l'interieur de la zone de vue sont affichée.
 * lors de la phase de rendu, le WorldPlayer génère des évènements
 * indiquant les coordonnées des portions qu'il souhaite afficher
 * C'est à l'appli, en réponse à ces évènements, de fournir les portions
 * sous forme d'un canvas ou d'une image.
 *
 *
 *
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
	 * Setter / getter d'un objet Fairy.View
	 * Cet objet permet de définir la fenetre de vue du world layer
	 * @param v {Fairy.View=}
     * @return {Fairy.View|Fairy.WorldLayer}
     */
    view: function(v) {
    	return this.prop('_view', v);
	},

    /**
     * Setter / Getter de la largeur des zones.
     * On considère le monde infini. Une zone est une portion de ce monde infini.
     *
     * @param z {int=} largeur d'une zone
     * @return {object|Fairy.WorldLayer}
     */
    zoneWidth: function(z) {
        return this.prop('_zoneWidth', z);
    },

    /**
     * Setter / Getter de la hauteur des zones.
     * On considère le monde infini. Une zone est une portion de ce monde infini.
     *
     * @param z {int=} hauteur d'une zone
     * @return {int|Fairy.WorldLayer}
     */
    zoneHeight: function(z) {
        return this.prop('_zoneHeight', z);
    },

    /**
	 * Setter / Getter de zones
	 * C'est une collection de Zones : celle qui sont actuellement chargée et qui peuvent etre affichées à tout moement
	 * Généralement cet accesseur n'est utilisé qu'en tant que getter.
     * @param o {object=} liste des zone
	 * @return {object|Fairy.WorldLayer}
     */
	zones: function(o) {
		return this.prop('_zones', o);
	},

    /**
	 * Setter / Getter du flag moreZone
	 * Quand la fenetre de View penetre dans une zone, cela déclenche immédiatemennt un évènement
	 * réclamenet le chargement de la zone. avec ce Flag l'évènement est déclenché pour toutes les zones contigues.
     * @param b {boolean=}
	 * @return {boolean|Fairy.WorldLayer}
     */
	moreZones: function(b) {
        return this.prop('_moreZone', b);
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
		let p = this.view().points();
		let cw = this.zoneWidth();
		let ch = this.zoneHeight();
		let vx = p[0].x;
		let vy = p[0].y;
		let xs = Math.floor(vx / cw);
		let ys = Math.floor(vy / ch);
		let xe = Math.floor(p[1].x / cw);
		let ye = Math.floor(p[1].y / ch);
		if (this.moreZones()) {
			--xs;
			--ys;
			++xe;
			++ye;
		}
		let sKey, oNow = {};
		let oPrev = this.zones();
		let a = {
			d: [], // zone à décharger (ne sert plus car sort de la zone de vue)
			n: [], // nouvelle zone à charger, vien d'apparaitre dans la vue
			a: [] // zone toucjourr affichée
		};
		
		for (let x, y = ys; y <= ye; ++y) {
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
		for (let s in a) {
			a[s].forEach((function(key) {
				this.trigger('zone.' + s, oNow[key]);
			}).bind(this));
		}
		return this;
	},
	
	/**
	 * Rendu du layer
	 * @param oContext {object}
	 */
	render: function(oContext) {
		let zc;
		let z = this.zones();
		let p = this.view().points();
		let cw = this.zoneWidth();
		let vx = p[0].x;
		let vy = p[0].y;
		for (let c in z) {
			zc = z[c];
			if (zc.canvas) {
				oContext.drawImage(zc.canvas, zc.x * cw - vx, zc.y * cw - vy);
			}
		}
	}
});

O2.mixin(Fairy.WorldLayer, O876.Mixin.Prop);
O2.mixin(Fairy.WorldLayer, O876.Mixin.Events);
