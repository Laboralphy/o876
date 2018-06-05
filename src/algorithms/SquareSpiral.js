/**
 * @class SquareSpiral
 * This simple class builds a squared shape spiral
 * and reports all cells into an ordered list of Point
 * starting from the spiral center.
 */

module.exports = class SquareSpiral {
	/**
	 * Renvoie la largeur d'un carré de snail selon le niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément sur le coté
	 */
	static _getLevelSquareWidth(nLevel) {
		return nLevel * 2 + 1;
	}
	
	/**
	 * Renvoie le nombre d'éléments qu'il y a dans un niveau
	 * @param nLevel niveau
	 * @return int nombre d'élément
	 */
	static _getLevelItemCount(nLevel) {
		let w = SquareSpiral._getLevelSquareWidth(nLevel);
		return 4 * w - 4;
	}
	
	/**
	 * Renvoie le niveau auquel appartient ce secteur
	 * le niveau 0 correspond au point 0, 0
	 */
	static _getLevel(x, y) {
		x = Math.abs(x);
		y = Math.abs(y);
		return Math.max(x, y);
	}
	
	/**
	 * Renvoie tous les secteurs de niveau spécifié
	 */
	static build(nLevelMin, nLevelMax) {
		if (nLevelMax === undefined) {
			nLevelMax = nLevelMin;
		}
		if (nLevelMin > nLevelMax) {
			throw new Error('levelMin must be lower or equal levelMax');
		}
		if (nLevelMin < 0) {
			return [];
		}
		let aSectors = [];
		let n, x, y;
		for (y = -nLevelMax; y <= nLevelMax; ++y) {
			for (x = -nLevelMax; x <= nLevelMax; ++x) {
				n = SquareSpiral._getLevel(x, y);
				if (n >= nLevelMin && n <= nLevelMax) {
					aSectors.push({x: x, y: y});
				}
			}
		}
		return aSectors;
	}
};
