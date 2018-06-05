/**
 * Created by ralphy on 06/09/17.
 */

const Helper = require('../../geometry/Helper');
const Nood = require('./Nood');
const NoodList = require('./NoodList');
const Emitter = require('../../Emitter');
const Point = require('../../geometry/Point');
const SB = require('../../SpellBook');

/**
 * @class
 * this class is an implementation of a-star path finding algorithm
 * how to use :
 * const pf = new Astar()
 * pf.init({
 * 	grid: [[][]..] give a 2D array of cells here
 * 	walkable: code for walkable cell in the grid
 * 	diagonals: true if you want to allow diagonal moves
 * 	max: maximum iteration (act as watch dog)
 * })
 * pf.find(xfrom, yfrom, xto, yto)
 */
module.exports = class Astar {
	constructor() {
		// configuration
		this._bUseDiagonals = false;
        this._grid = null;
        this._width = 0;
        this._height = 0;
		this.MAX_ITERATIONS = 4096;
        this.GRID_BLOCK_WALKABLE = 0;

		// working objects and variables
        this.oOpList = null;
        this.oClList = null;
        this.aPath = null;
		this.nIterations = 0;

		// utilities
		this.emitter = new Emitter();
	}

    on() { this.emitter.on(...arguments); return this; }
    off() { this.emitter.off(...arguments); return this; }
    one() { this.emitter.one(...arguments); return this; }
    trigger() { this.emitter.trigger(...arguments); return this; }

    /**
	 * modifies a cell value
     */
	_setCell(x, y, n) {
		if (this._grid[y] !== undefined && this._grid[y][x] !== undefined) {
			this._grid[y][x] = n;
		} else {
			throw new Error(
				'Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	}

	_getCell(x, y) {
		if (this._grid[y]) {
			if (x < this._grid[y].length) {
				return this._grid[y][x];
			}
		}
		throw new Error('Astar: read tile out of Grid: ' + x + ', ' + y);
	}

	_isCellWalkable(x, y) {
		try {
			let r = {
				walkable: this._getCell(x, y) === this.GRID_BLOCK_WALKABLE,
				cell: {
					x: x,
					y: y
				}
			};
			this.trigger('walkable', r);
			return r.walkable;
		} catch (e) {
			return false;
		}
	}

	_closeNood(x, y) {
		let n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	}

	_addAdjacent(x, y, xArrival, yArrival) {
		let i, j;
		let i0, j0;
		let oTmp;
		let w = this._width, h = this._height, bDiag = this._bUseDiagonals;
		for (i0 = -1; i0 <= 1; i0++) {
			i = x + i0;
			if ((i < 0) || (i >= w)) {
				continue;
			}
			for (j0 = -1; j0 <= 1; j0++) {
				if (!bDiag && (j0 * i0) !== 0) {
					continue;
				}
				j = y + j0;
				if ((j < 0) || (j >= h)) {
					continue;
				}
				if ((i === x) && (j === y)) {
					continue;
				}
				if (!this._isCellWalkable(i, j)) {
					continue;
				}

				if (!this.oClList.exists(i, j)) {
					oTmp = new Nood();
					oTmp.fGCost = this.oClList.get(x, y).fGCost	+ Helper.distance(i, j, x, y);
					oTmp.fHCost = Helper.distance(i, j, xArrival, yArrival);
					oTmp.fFCost = oTmp.fGCost + oTmp.fHCost;
					oTmp.oPos = new Point(i, j);
					oTmp.oParent = new Point(x, y);

					if (this.oOpList.exists(i, j)) {
						if (oTmp.fFCost < this.oOpList.get(i, j).fFCost) {
							this.oOpList.set(i, j, oTmp);
						}
					} else {
						this.oOpList.set(i, j, oTmp);
					}
				}
			}
		}
	}

	// Recherche le meilleur noeud de la liste et le renvoi
	_bestNood(oList) {
		let oBest = null;
		let oNood;

		for (let iNood in oList.oList) {
			oNood = oList.oList[iNood];
			if (oBest === null) {
				oBest = oNood;
			} else if (oNood.fFCost < oBest.fFCost) {
				oBest = oNood;
			}
		}
		return oBest;
	}

    _buildPath(xTo, yTo) {
        let oCursor = this.oClList.get(xTo, yTo);
        if (oCursor !== null) {
            while (!oCursor.isRoot()) {
                this.aPath.unshift({
                    x: oCursor.oPos.x,
                    y: oCursor.oPos.y
                });
                oCursor = this.oClList.get(oCursor.oParent.x, oCursor.oParent.y);
            }
        }
    }

	find(xFrom, yFrom, xTo, yTo) {
		this.reset();
		let oBest;
		let oDepart = new Nood();
		oDepart.oPos = new Point(xFrom, yFrom);
		oDepart.oParent = new Point(xFrom, yFrom);
		let xCurrent = xFrom;
		let yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this._closeNood(xCurrent, yCurrent);
		this._addAdjacent(xCurrent, yCurrent, xTo, yTo);

		let iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent === xTo) && (yCurrent === yTo)) && (!this.oOpList.empty())) {
			oBest = this._bestNood(this.oOpList);
			if (!oBest) {
				// could not find path
                throw new Error('Astar: no path to destination');
			}
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this._closeNood(xCurrent, yCurrent);
			this._addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent === xTo) && (yCurrent === yTo))) {
			throw new Error('Astar: no path to destination');
		}
		this.nIterations = iIter;
		this._buildPath(xTo, yTo);
		return this.aPath;
	}

    /**
	 * Changes a cell value inside the grid
     * @param x {number} cell coordinates
     * @param y {number} cell coordinates
     * @param (v) {number} new value
     * @return {*}
     */
	cell(x, y, v) {
        if (v === undefined) {
            return this._getCell(x, y);
        } else {
            this._setCell(x, y, v);
            return this;
        }
    }

    /**
     * resets the grid
     * @return {*}
     */
    reset() {
        this.oOpList = new NoodList();
        this.oClList = new NoodList();
        this.aPath = [];
        this.nIterations = 0;
        return this;
    }

    /**
     * Setter/Getter of the internal grid.
     * @param (g) {[]}
     * @return {[]|Astar}
     */
    grid(g) {
        if (g !== undefined) {
            this._height = g.length;
            this._width = g[0].length;
        }
        return SB.prop(this, '_grid', g);
    }

	/**
	 * Setter/getter of the walkable code.
	 * This code is use to determine if a grid cell is walkable or not.
	 * @param (w) {string|number}
	 * @return {string|number|Astar}
	 */
	walkable(w) {
		return SB.prop(this, 'GRID_BLOCK_WALKABLE', w);
	}

	/**
	 * Setter/getter of the diagonal flag.
	 * if set to true, the path finder will cross the grid diagonaly if needed.
	 * @param (b) {boolean}
	 * @return {boolean|Astar}
	 */
	diagonals(b) {
		return SB.prop(this, '_bUseDiagonals', b);
	}
};
