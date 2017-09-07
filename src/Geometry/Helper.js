/**
 * Created by ralphy on 07/09/17.
 */

/**
 * A simple helper class
 */
export default class Helper {
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
}
