/**
 * Permet de mettre en cache des information indéxées par une coordonnées 2D
 */
class Cache2D {
	constructor() {
		this._cache = [];
		this._cacheSize = 64;
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

	push(x, y, payload) {
		let c = this._cache;
		if (!this.getMetaData(x, y)) {
			c.push({
				x, y, payload
			});
		}
		while (c.length > this._cacheSize) {
			c.shift();
		}
	}
}

module.exports = Cache2D;