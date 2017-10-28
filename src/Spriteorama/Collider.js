/**
 * @class Collider
 * The collider computes collision between sprites.
 * Sprites are positionned inside the collider grid, according to their position
 * Each sprites is tested against all other sprite in the surroundiing cells.
 */

import Vector from '../Geometry/Vector';
import Grid from './Grid';

export default class Collider {
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
	 * @param x {number} position x
	 * @param y {number} position y
	 * @return {*}
	 */
	sector(x, y) {
		if (y === undefined) {
			return this._grid.cell(x.x / this._cellWidth, x.y / this._cellHeight);
		} else {
			return this._grid.cell(x, y);
		}
	}

	/**
	 * Registers an object in the sector it belongs
	 * Unregisters the objet in all other sector
	 * @param oObject {Mobile}
	 */
	track(oObject) {
		let oOldSector = oObject.colliderSector;
		let v = oObject.flight().position().sub(this._origin);
		let s = oObject.dead() ? null : this.sector(v);
		if (s && oOldSector && s === oOldSector) {
			return;
		}
		if (oOldSector) {
			oOldSector.remove(oObject);
		}
		if (s) {
			s.add(oObject);
		}
		oObject.colliderSector = s;
		return this;
	}

	/**
	 * Effectue tous les test de collision entre un objet et tous les autres objets
	 * contenus dans les secteur adjacent a celui de l'objet
	 * @param oObject {Mobile}
	 * @return {Mobile[]} liste d'objet collisionnant
	 */
	collides(oObject) {
		let aObjects = [];
		let oSector = this.sector(oObject.flight().position().sub(this._origin));
		if (!oSector) {
			return aObjects;
		}
		let x = oSector.x;
		let y = oSector.y;
		let a = [];
		let xMin = Math.max(0, x - 1);
		let yMin = Math.max(0, y - 1);
		let xMax = Math.min(this.width() - 1, x + 1);
		let yMax = Math.min(this.height() - 1, y + 1);
		let ix, iy;
		for (iy = yMin; iy <= yMax; ++iy) {
			for (ix = xMin; ix <= xMax; ++ix) {
				a = a.concat(this.sector(ix, iy).collides(oObject));
			}
		}
		return a;
	}
}