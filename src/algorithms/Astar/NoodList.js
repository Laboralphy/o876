/**
 * Created by ralphy on 06/09/17.
 */

/**
 * The NoodList class is a simple class aimed at facilitating nood list manipulations
 */
module.exports = class NoodList {
	constructor() {
		this.oList = {};
	}

	/**
	 * adds an instance of Nood in the list
	 * @param oNood
	 */
	add(oNood) {
		this.set(oNood.oPos.x, oNood.oPos.y, oNood);
	}

	/**
	 * Sets an instance of Nood in the list
	 * a Nood is indexed by its position. Thus two Nood shall not have the same x and y pair
	 * @param x {number}
	 * @param y {number}
	 * @param oNood {Nood}
	 */
	set(x, y, oNood) {
		this.oList[this.getKey(x, y)] = oNood;
	}

	/**
	 * Returns the numbers of Nood in the list
	 * @return {number}
	 */
	count() {
		return Object(this.oList).length;
	}

	/**
	 * Returns true if the spécified position (x, y) has a matching Nood in the list
	 * @param x {number}
	 * @param y {number}
	 * @returns {boolean}
	 */
	exists(x, y) {
		return this.getKey(x, y) in this.oList;
	}

	/**
	 * Creates a key from an x and y values
	 * @param x {number}
	 * @param y {number}
	 * @returns {string}
	 */
	getKey(x, y) {
		return x.toString() + '__' + y.toString();
	}

	/**
	 * Gets the Nood matching the given x y pair
	 * Returns null if does not exists
	 * @param x {number}
	 * @param y {number}
	 * @returns {Nood|null}
	 */
	get(x, y) {
		return this.oList[this.getKey(x, y)] || null;
	}

	/**
	 * Remove a Nood from the list with the given coordinates
	 * @param x {number}
	 * @param y {number}
	 */
	del(x, y) {
		delete this.oList[this.getKey(x, y)];
	}

	/**
	 * Returns true if the liste is empty
	 * @returns {boolean}
	 */
	empty() {
		return this.count() === 0;
	}
};