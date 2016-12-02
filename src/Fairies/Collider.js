/**
 * Le collisioneur permet de calculer les collision entre les sprites
 * Le principe : Les sprites, quand ils sont positionnés , s'enregistrent dans
 * les secteurs d'une grille appliquée au monde.
 * Chaque sprite est confronté aux autres sprites de son secteur lorsqu'il
 * est temps de calculer les collisions
 */
O2.createClass('Fairy.Collider',	{
	_grid: null,
	_cellWidth : 0,
	_cellHeight : 0,
	_width: 0,
	_height: 0,

	/**
	 * Reconstruit les sectoeur de la grille d'après les dimensions
	 */
	_rebuildGrid: function(w, h) {
		var g = [];
		var x, y, aRow, oSector;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				oSector = new Fairy.Sector();
				oSector.x = x;
				oSector.y = y;
				aRow.push(oSector);
			}
			g.push(aRow);
		}
		this.grid(g);
	},

	width: function(w) {
		if (w !== undefined) {
			this._rebuildGrid(w, this._height);
		}
		return this.prop('_width', w);
	},

	height: function(h) {
		if (h !== undefined) {
			this._rebuildGrid(this._width, h);
		}
		return this.prop('_height', h);
	},

		/**
	 * Renvoie le secteur désigné par les coordonnées spécifiée
	 * @param x position x
	 * @param y position y
	 * @return une cellule de la grille
	 */
	sector: function(x, y) {
		if (y === undefined) {
			return this.sector(x.x / this._cellWidth | 0, x.y / this._cellWidth | 0);
		} else if (y < 0 || x < 0 || y >= this._height || x > this._width) {
			return null;
		} else {
			return this._grid[y | 0][x | 0];
		}
	},

	/**
	 * Enregistre ou desenregistre un objet dans les sectoeurs
	 */
	track: function(oObject) {
		var oOldSector = oObject.data('__colliderSector');
		var v = oObject.flight().position();
		var s = this.sector(v);
		if (s && oOldSector && s == oOldSector) {
			return;
		}
		if (oOldSector) {
			oOldSector.remove(oObject);
		}
		if (s) {
			s.add(oObject);
		}
		oObject.data('__colliderSector', s);
		return this;
	},

	/**
	 * Effectue tous les test de collision entre un objet et tous les autres objets
	 * contenus dans les secteur adjacent a celui de l'objet
	 * @param oObject
	 * @return liste d'objet collisionnant
	 */
	collides: function(oObject) {
		var aObjects = [];
		var oSector = this.sector(oObject.flight().position());
		if (!oSector) {
			return aObjects;
		}
		var x = oSector.x;
		var y = oSector.y;
		var a = [];
		var xMin = Math.max(0, x - 1);
		var yMin = Math.max(0, y - 1);
		var xMax = Math.min(this._width - 1, x + 1);
		var yMax = Math.min(this._height - 1, y + 1);
		var ix, iy;
		for (iy = yMin; iy <= yMax; ++iy) {
			for (ix = xMin; ix <= xMax; ++ix) {
				a = a.concat(this.sector(ix, iy).collides(oObject));
			}
		}
		return a;
	}
});

O2.mixin(Fairy.Collider, O876.Mixin.Prop);