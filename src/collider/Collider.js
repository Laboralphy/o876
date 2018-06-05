/**
 * @class Collider
 * The collider computes collision between sprites.
 * Sprites are positionned inside the collider grid, according to their position
 * Each sprites is tested against all other sprite in the surroundiing cells.
 */

const Vector = require('../geometry/Vector');
const Grid = require('../structures/Grid');
const Sector = require('./Sector');
const SB = require('../SpellBook');

module.exports = class Collider {
	constructor() {
        this._origin = new Vector(); // vector origine du layer
        this._grid = new Grid();
        this._grid.on('rebuild', function(data) {
            let oSector = new Sector();
            oSector.x = data.x;
            oSector.y = data.y;
            data.cell = oSector;
        });
        this._cellWidth = 0;
        this._cellHeight = 0;
	}

    cellWidth(w) {
        return SB.prop(this, '_cellWidth', w);
    }

    cellHeight(h) {
        return SB.prop(this, '_cellHeight', h);
    }

    width(w) {
        if (w === undefined) {
            return this._grid.width();
        } else {
            this._grid.width(w);
            return this;
        }
    }

    height(h) {
        if (h === undefined) {
            return this._grid.height();
        } else {
            this._grid.height(h);
            return this;
        }
    }

	/**
	 * Return the sector corresponding to the given coordinates
     * if the parameters are number, the real sector indices are used (0, 1, 2...)
	 * if the parameter is a Vector, its components are int-divided by cell size before application
	 * @param x {number} position x
	 * @param y {number} position y
	 * @return {*}
	 */
	sector(x, y) {
		if (y === undefined) {
			return this._grid.cell(x.x / this._cellWidth | 0, x.y / this._cellHeight | 0);
		} else {
			return this._grid.cell(x, y);
		}
	}

	/**
	 * Registers an object in the sector it belongs
	 * Unregisters the objet in all other sector
	 * @param oDummy {Dummy}
	 */
	track(oDummy) {
		let oOldSector = oDummy.colliderSector;
		let v = oDummy.position().sub(this._origin);
		let s = oDummy.dead() ? null : this.sector(v);
		if (s && oOldSector && s === oOldSector) {
			return;
		}
		if (oOldSector) {
			oOldSector.remove(oDummy);
		}
		if (s) {
			s.add(oDummy);
		}
		oDummy.colliderSector = s;
		return this;
	}

	/**
	 * Effectue tous les test de collision entre un objet et tous les autres objets
	 * contenus dans les secteur adjacent a celui de l'objet
	 * @param oDummy {Dummy}
	 * @return {Dummy[]} liste d'objet collisionnant
	 */
	collides(oDummy) {
		let a = [];
		let oSector = this.sector(oDummy.position().sub(this._origin));
		if (!oSector) {
			return a;
		}
		let x = oSector.x;
		let y = oSector.y;
		let xMin = Math.max(0, x - 1);
		let yMin = Math.max(0, y - 1);
		let xMax = Math.min(this.width() - 1, x + 1);
		let yMax = Math.min(this.height() - 1, y + 1);
		let ix, iy;
		for (iy = yMin; iy <= yMax; ++iy) {
			for (ix = xMin; ix <= xMax; ++ix) {
				a = a.concat(this.sector(ix, iy).collides(oDummy));
			}
		}
		return a;
	}
};