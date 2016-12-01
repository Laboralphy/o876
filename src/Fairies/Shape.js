O2.createClass('Fairy.Shape', {
	_flight : null,
	_tangibility : 1,

	__construct: function() {
	},

	// Pour savoir si l'objet A percute l'objet B on fait (A.nTangibilityMask &
	// B.nTangibilityMask) si le résultat
	// Si le resultat est différent de 0, les deux objet sont susceptible de
	// collision (si leurs shapes se recouvrent)

	/**
	 * Renvoie true si x est entre x1 et x2
	 * @param float x valeur à tester
	 * @param float x1 borne inf
	 * @param float x2 borne sup
	 * @return boolean
	 */
	between : function(x, x1, x2) {
		if (x1 == x2) {
			return x == x1;
		} else if (x1 < x2) {
			return x >= x1 && x <= x2;
		} else {
			return x >= x2 && x <= x1;
		}
	},

	/**
	 * Renvoie la distance au carré entre deux points
	 * @param Vector2D v1 
	 * @param Vector3D v2
	 * @return float
	 */
	squareDistance : function(v1, v2) {
		var x1 = v1.x;
		var y1 = v1.y;
		var x2 = v2.x;
		var y2 = v2.y;
		return ((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1));
	},

	/**
	 * Renvoie la distance entre deux points, tsoin, tsoin
	 * @param Vector2D v1 
	 * @param Vector3D v2
	 * @return float
	 */
	distance: function(v1, v2) {
		return Math.sqrt(this.squareDistance(v1, v2));
	},

	/**
	 * renvoie TRUE si v1 et v2 sont à une distance max de d
	 * @param Vector2D v1 
	 * @param Vector3D v2
	 * @return boolean
	 */
	nearer: function(v1, v2, d) {
		return (d * d) > this.squareDistance(v1, v2);
	},

	/**
	 * Renvoie true si le point spécifé est dans la forme
	 */
	inside: function(v) {
		return false;
	},

	/**
	 * Renvoie un tableau de points clé
	 * Permettant de déterminer les collision
	 */
	points: function() {
		return [];
	},

	/**
	 * Renvoie TRUE si oShape percute this
	 * @param CollisionShape oShape
	 * @return boolean
	 */
	hits: function(oShape) {
		return (oShape.tangibility() & this.tangibility()) !== 0;
	}
});


O2.mixin(Fairy.Shape, O876.Mixin.Prop);
