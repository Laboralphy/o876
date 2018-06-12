const Vector = require('./Vector');
const sb =  require('../SpellBook');

class View {
	constructor() {
		this._offset = new Vector();
		this._position = new Vector();
		this._width = 0;
		this._height = 0;
	}

	offset(v) {
		return sb.prop(this, '_offset', v);
	}

	position(v) {
		return sb.prop(this, '_position', v);
	}

	width(n) {
		return sb.prop(this, '_width', n);
	}

	height(n) {
		return sb.prop(this, '_height', n);
	}

	center() {
		this.offset(new Vector(this.width() >> 1, this.height() >> 1));
	}

	points() {
		let p0 = this._position.sub(this._offset);
		let p1 = p0.add(new Vector(this._width, this._height));
		return [p0, p1];
	}
}