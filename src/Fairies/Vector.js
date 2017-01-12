O2.createClass('Fairy.Vector', {
	x: 0,
	y: 0,
	
	__construct: function(x, y) {
		if (x !== undefined) {
			this.set(x, y);
		}
	},
	
	/**
	 * Définit la value des composante du vecteur
	 * @param x composante x
	 * @param y composante y
	 */
	set: function(x, y) {
		if (x !== undefined) {
			if (y === undefined) {
				this.x = x.x;
				this.y = x.y;
			} else {
				this.x = x;
				this.y = y;
			}
		}
		return this;
	},

	/**
	 * Ajoute le vecteur, a celui spécifié en paramètre
	 */
	trans: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

	scale: function(n) {
		this.x *= n;
		this.y *= n;
		return this;
	},
	
	/**
	 * Ajoute ce vecteur à un autre,
	 * renvoie le resultat dans un nouveau vecteur
	 * @param v
	 * @return nouveau Fairy.Vector
	 */
	add: function(v) {
		return this.clone().trans(v);
	},
	
	/**
	 * Soustrait un vecteur à ce vecteur
	 */
	sub: function(v) {
		var r = this.clone();
		r.x -= v.x;
		r.y -= v.y;
		return r;
	},
	
	clone: function() {
		return new Fairy.Vector(this);
	},
  
	norm: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	},

	normalize: function() {
		return this.scale(1 / this.norm());
	}
});

Fairy.Vector.ZERO = new Fairy.Vector(0, 0);
