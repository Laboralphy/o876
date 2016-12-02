O2.createClass('Fairy.Grid', {
	_cells: null,
	_width: 0,
	_height: 0,
	
	/**
	 * Reconstruit la grille d'après les dimensions
	 */
	_rebuild: function(w, h) {
		var g = [];
		var x, y, aRow, oCell, data;
		for (y = 0; y < h; y++) {
			aRow = [];
			for (x = 0; x < w; x++) {
				data = {x: x, y: y, width: w, height: h, cell: null};
				this.trigger('rebuild', data);
				aRow.push(data.cell);
			}
			g.push(aRow);
		}
		this.cells(g);
	},
	
	cell: function(x, y, v) {
		x |= 0;
		y |= 0;
		if (v === undefined) {
			if (y < 0 || x < 0 || y >= this._height || x > this._width) {
				return null;
			} else {
				return this._cells[y][x];
			}
		} else {
			if (y < 0 || x < 0 || y >= this._height || x > this._width) {
				this._cells[y][x] = v;
			}
			return this;
		}
	},

	width: function(w) {
		if (w !== undefined) {
			this._rebuild(w, this._height);
		}
		return this.prop('_width', w);
	},

	height: function(h) {
		if (h !== undefined) {
			this._rebuild(this._width, h);
		}
		return this.prop('_height', h);
	},
});

O2.mixin(Fairy.Grid, O876.Mixin.Events);
O2.mixin(Fairy.Grid, O876.Mixin.Prop);
