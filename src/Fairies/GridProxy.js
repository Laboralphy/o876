O2.createObject('Fairy.Mixin.GridProxy', {
	width: function(w) {
		if (w === undefined) {
			return this._grid.width();
		} else {
			this._grid.width(w);
			return this;
		}
	},

	height: function(h) {
		if (h === undefined) {
			return this._grid.height();
		} else {
			this._grid.height(h);
			return this;
		}
	}
});
