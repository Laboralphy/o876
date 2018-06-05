/**
 * Created by ralphy on 07/09/17.
 */

/**
 * A simple helper class
 */
module.exports = class Helper {
	/**
	 * Distance between 2 points
	 * @param x1 {Number} point 1 coordinates
	 * @param y1 {Number}
	 * @param x2 {Number} point 2 coordinates
	 * @param y2 {Number}
	 * @return {number} distance
	 */
	static distance(x1, y1, x2, y2) {
		let dx = x1 - x2;
		let dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	}

    /**
	 * Renvoie l'ange que fait la doite x1, y1, x2, y2
	 * avec l'axe des X+
     * @param x1 {number}
     * @param y1 {number}
     * @param x2 {number}
     * @param y2 {number}
	 * @return {number}
     */
	static angle(x1, y1, x2, y2) {
		return Math.atan2(y2 - y1, x2 - x1);
	}

	/**
	 * A partir d'un angle et d'une norme, calcule deux composant d'un référentiel rectangulaire
	 * @param angle
	 * @param norm
	 */
	static polar2rect(angle, norm) {
		return {dx: norm * Math.cos(angle), dy: norm * Math.sin(angle)};
	}
};