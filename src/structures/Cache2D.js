const sb = require('../SpellBook');
/**
 * Permet de mettre en cache des information indéxées par une coordonnées 2D
 */
class Cache2D {
	constructor(d = null) {
		let size = 64;
		if (d) {
			size = d.size || size;
		}
		this._cache = [];
		this._cacheSize = size;
	}

	size(s) {
		return sb.prop(this, '_cacheSize', s);
	}

	clear() {
		this._cache = [];
	}

	getMetaData(x, y) {
		return this._cache.find(o => o.x === x && o.y === y);
	}

	getPayload(x, y) {
		let o = this.getMetaData(x, y);
		if (o) {
			return o.payload;
		} else {
			return null;
		}
	}

	trim() {
		let c = this._cache;
		c.sort((a, b) => b.n - a.n);
		let aDelete = [];
		while (c.length > this._cacheSize) {
			aDelete.push(c.shift());
		}
		return aDelete;
	}

	push(x, y, payload) {
		let c = this._cache;
		let md = this.getMetaData(x, y);
		if (!md) {
			c.push({
				x, y, n: 0, payload
			});
		} else {
			++md.n;
		}
		return this.trim();
	}
}

module.exports = Cache2D;