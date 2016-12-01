O2.extendClass('Fairy.Rect', Fairy.Shape, {
	_p1: null,
	_p2: null,

	__construct: function() {
		__inherited();
		this._p1 = new Fairy.Vector();
		this._p2 = new Fairy.Vector();
	},

	p1: function(p) {
		if (p === undefined) {
			return this._p1;
		} else {
			this._p1 = p;
			return this;
		}
	},

	p2: function(p) {
		if (p === undefined) {
			return this._p2;
		} else {
			this._p2 = p;
			return this;
		}
	},

	points: function() {
		var p1 = this._p1;
		var p2 = this._p2;
		var x1 = Math.min(p1.x, p2.x);
		var y1 = Math.min(p1.y, p2.y);
		var x2 = Math.max(p1.x, p2.x);
		var y2 = Math.max(p1.y, p2.y);
		var p = this.flight().position();
		return [
			(new Fairy.Vector(x1, y1)).trans(p),
			(new Fairy.Vector(x2 - 1, y2 - 1)).trans(p)
		];
	},


	_getCollisionAxis: function(f, fMin, fMax) {
		if (f < fMin) {
			return 1;
		}
		if (f > fMax) {
			return 3;
		}
		return 2;
	},


	/**
	 * Renvoie un code secteur correspondant au point spécifié
	 * Permet de resoudre les collision
	 * @param p vector
	 */
	_getCollisionSector: function(v) {
		var p = this.points();
		var p1 = p[0]; 
		var p2 = p[1]; 
		var a = this._getCollisionAxis(v.x, p1.x, p2.x);
		var b = this._getCollisionAxis(v.y, p1.y, p2.y);
		/*
		1 2 3
		4 5 6
		7 8 9
		*/
		switch ((a << 4) | b) {
			case 0x11: return 1;
			case 0x12: return 4;
			case 0x13: return 7;

			case 0x21: return 2;
			case 0x22: return 5;
			case 0x23: return 8;

			case 0x31: return 3;
			case 0x32: return 6;
			case 0x33: return 9;
		}
	},

	inside: function(v) {
		var p = this.points();
		return this.between(v.x, p[0].x, p[1].x) && this.between(v.y, p[0].y, p[1].y);
	},

	/**
	 * Renvoie true si la forme superpose même partiellement l'autre forme spécifiée en param
	 * @param oShape autre forme
	 * @return boolean
	 */
	hits: function(oShape) {
		/*
		1 2 3
		4 5 6
		7 8 9
		*/
		if (!__inherited(oShape)) {
			return false;
		}
		var pMine = this.points();
		var pIts = oShape.points();;
		var s1 = this._getCollisionSector(pIts[0]);
		var s2 = this._getCollisionSector(pIts[1]);
		if (s2 < s1) {
			throw new Error('weird error : unexpected collision case ' + s2 + ' > ' + s1);
		}
		switch ((s1 << 4) | s2) {
			case 0x11:
			case 0x12:
			case 0x13:
			case 0x14:
			case 0x17:

			case 0x22:
			case 0x23:

			case 0x33:
			case 0x36:
			case 0x39:

			case 0x44:
			case 0x47:

			case 0x66:
			case 0x69:

			case 0x77:
			case 0x78:
			case 0x79:

			case 0x88:
			case 0x89:

			case 0x99:
				return false;

			default:
				return true;
		} 
 	}
});

O2.mixin(Fairy.Rect, O876.Mixin.Prop);
