/**
 * Created by ralphy on 06/09/17.
 */

import Helper from '../Geometry/Helper';
import Nood from './Nood';
import NoodList from './NoodList';
import Emitter from '../Emitter';
import Point from '../Geometry/Point';
import SB from '../SpellBook'


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
export default class {
	constructor() {
		this.bUseDiagonals = false;
		this.MAX_ITERATIONS = 2048;
		this.nIterations = 0;
		this._grid = null;
		this.nWidth = 0;
		this.nHeight = 0;
		this.oOpList = null;
		this.oClList = null;
		this.aPath = null;
		this.GRID_BLOCK_WALKABLE = 0;
		this.emitter = new Emitter();
        this.emitter.instance(this);
	}

    /**
	 * Set a new grid, or ask for the current one
	 * @param g {(array)}
	 * @return {array|object}
     */
    grid(g) {
    	if (g !== undefined) {
            this.nHeight = g.length;
            this.nWidth = g[0].length;
		}
    	return SB.prop(this, '_grid', g);
	}

	/**
	 * initialize the grid
	 * {
	 * 		grid: [[......][.......]....],  // 2Dim Array containing the grid
	 * 		diagonals: {bool} use the diagonals
	 * 		max: (watch dog)
	 *		walkable : specify a walkable code
	 * }
     * @param c {object}
     * @param c.grid {array}
     * @param c.diagonals {boolean}
     * @param c.max {number}
     * @param c.walkable {number}
	 */
	init(c) {
		if ('grid' in c) {
			this.grid(c.grid);
		}
		if ('diagonals' in c) {
			this.bUseDiagonals = c.diagonals;
		}
		if ('max' in c) {
			this.MAX_ITERATIONS = c.max;
		}
		if ('walkable' in c) {
			this.GRID_BLOCK_WALKABLE = c.walkable;
		}
	}

	/**
	 * resets the grid
	 */
	reset() {
		this.oOpList = new NoodList();
		this.oClList = new NoodList();
		this.aPath = [];
		this.nIterations = 0;
	}

    /**
	 * modifies a cell value
     */
	setCell(x, y, n) {
		if (this._grid[y] !== undefined && this._grid[y][x] !== undefined) {
			this._grid[y][x] = n;
		} else {
			throw new Error(
				'O876.Astar: writing tile out of Grid: ' + x + ', ' + y);
		}
	}

	getCell(x, y) {
		if (this._grid[y]) {
			if (x < this._grid[y].length) {
				return this._grid[y][x];
			}
		}
		throw new Error('O876.Astar: read tile out of Grid: ' + x + ', ' + y);
	}

	cell(x, y, v) {
		if (v === undefined) {
			return this.getCell(x, y);
		} else {
			this.setCell(x, y, v);
			return this;
		}
	}

	isCellWalkable(x, y) {
		try {
			let r = {
				walkable: this.getCell(x, y) === this.GRID_BLOCK_WALKABLE,
				cell: {
					x: x,
					y: y
				}
			};
			this.emitter.trigger('walkable', r);
			return r.walkable;
		} catch (e) {
			return false;
		}
	}

	closeNood(x, y) {
		let n = this.oOpList.get(x, y);
		if (n) {
			this.oClList.set(x, y, n);
			this.oOpList.del(x, y);
		}
	}

	addAdjacent(x, y, xArrival, yArrival) {
		let i, j;
		let i0, j0;
		let oTmp;
		let w = this.nWidth, h = this.nHeight, bDiag = this.bUseDiagonals;
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
				if (!this.isCellWalkable(i, j)) {
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
	bestNood(oList) {
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

	find(xFrom, yFrom, xTo, yTo) {
		this.reset();
		let oBest;
		let oDepart = new Nood();
		oDepart.oPos = new Point(xFrom, yFrom);
		oDepart.oParent = new Point(xFrom, yFrom);
		let xCurrent = xFrom;
		let yCurrent = yFrom;
		this.oOpList.add(oDepart);
		this.closeNood(xCurrent, yCurrent);
		this.addAdjacent(xCurrent, yCurrent, xTo, yTo);

		let iIter = 0, MAX = this.MAX_ITERATIONS;

		while (!((xCurrent === xTo) && (yCurrent === yTo)) && (!this.oOpList.empty())) {
			oBest = this.bestNood(this.oOpList);
			if (!oBest) {
				// could not find path
                throw new Error('O876.Astar: no path to destination');
			}
			xCurrent = oBest.oPos.x;
			yCurrent = oBest.oPos.y;
			this.closeNood(xCurrent, yCurrent);
			this.addAdjacent(oBest.oPos.x, oBest.oPos.y, xTo, yTo);
			if (++iIter > MAX) {
				throw new Error('O876.Astar: too much iterations');
			}
		}
		if (this.oOpList.empty() && !((xCurrent === xTo) && (yCurrent === yTo))) {
			throw new Error('O876.Astar: no path to destination');
		}
		this.nIterations = iIter;
		this.buildPath(xTo, yTo);
		return this.aPath;
	}

	buildPath(xTo, yTo) {
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
}
