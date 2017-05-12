/**
 * @class Fairy.Vector
 */
O2.createClass('Fairy.Vector', {
    /**
	 * @property x {number}
     */
	x: 0,
    /**
     * @property y {number}
     */
	y: 0,

    /**
	 * constructor
     * @param x {number|Fairy.Vector}
     * @param y {number|undefined}
	 * @constructor
     */
	__construct: function(x, y) {
		this.set(x, y);
	},

    /**
     * sets vector components
     * @param x {number|Fairy.Vector}
     * @param y {number|undefined}
     * @return {Fairy.Vector}
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
	 * translates the vector
	 * MUTABLE version
	 * use add() if you need immutability
	 * @param v {Fairy.Vector}
	 * @return {Fairy.Vector}
	 */
	trans: function(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	},

    /**
     * scales the vector
     * MUTABLE version
     * use mul() if you need immutability
     * @param n {number}
     * @return {Fairy.Vector}
     */
	scale: function(n) {
		this.x *= n;
		this.y *= n;
		return this;
	},
	

	/**
	 * reduce vector to norm 1
	 * MUTABLE version
	 * use vector.div(vector.norm()) for immutability
	 * @return {Fairy.Vector}
	 */
	normalize: function() {
		return this.scale(1 / this.norm());
	},

	////// IMMUTABLE ZONE //////  IMMUTABLE ZONE //////  IMMUTABLE ZONE ////// 
	////// IMMUTABLE ZONE //////  IMMUTABLE ZONE //////  IMMUTABLE ZONE ////// 
	////// IMMUTABLE ZONE //////  IMMUTABLE ZONE //////  IMMUTABLE ZONE ////// 

	// all methods below are IMMUTABLE

	/**
	 * adds two vectors.
	 * immutable version : no vectors are modified by this method
	 * a new vector is returned
	 * @param v {Fairy.Vector}
	 * @return {Fairy.Vector}
	 */
	add: function(v) {
		return this.clone().trans(v);
	},

	/**
     * subtracts two vectors.
     * immutable version : no vectors are modified by this method
     * a new vector is returned
	 * @param v {Fairy.Vector}
	 * @return {Fairy.Vector}
	 */
	sub: function(v) {
		var r = this.clone();
		r.x -= v.x;
		r.y -= v.y;
		return r;
	},
	
	/**
     * multiply a vector by a number.
     * immutable version : vector is not modified by this method
     * a new vector is returned
	 * @param f {number}
	 * @return {Fairy.Vector}
	 */
	mul: function(f) {
		return this.clone().scale(f);
	},

	/**
     * divides a vector by a number.
     * immutable version : vector is not modified by this method
     * a new vector is returned
	 * @param f {number}
	 * @return {Fairy.Vector}
	 */
	div: function(f) {
		return this.mul(1 / f);
	},
	
	/**
	 * clones the vector into a new one
	 * @return {Fairy.Vector}
	 */
	clone: function() {
		return new Fairy.Vector(this);
	},

	/**
	 * renvoie la norme du vecteur
	 * @return {number}
	 */
	norm: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
});

Fairy.Vector.ZERO = new Fairy.Vector(0, 0);
