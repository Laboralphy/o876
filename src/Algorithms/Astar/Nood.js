/**
 * Created by ralphy on 04/09/17.
 */

import Point from '../Geometry/Point.js';

export default class Nood {
	constructor() {
		this.fGCost = 0.0;
		this.fHCost = 0.0;
		this.fFCost = 0.0;
		this.oParent = new Point(0, 0);
		this.oPos = new Point(0, 0);
	}

	isRoot() {
		return this.oParent.x === this.oPos.x && this.oParent.y === this.oPos.y;
	}
}
