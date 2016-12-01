/**
 * Classe enregistrant les mobile qui s'aventure dans un secteur particulier
 * du monde. LEs Mobile d'un même secteurs sont testé entre eux pour savoir
 * Qui entre en collision avec qui. */
O2.createClass('Fairy.Sector', {
	_objects : null,
	x: -1,
	y: -1,

	__construct : function() {
		this._objects = [];
	},

	add: function(oObject) {
		this._objects.push(oObject);
	},

	remove: function(oObject) {
		var objects = this._objects;
		var n = objects.indexOf(oObject);
		if (n >= 0) {
			objects.splice(n, 1);
		}
	},

	/**
	 * Renvoie le nombre d'objet enregistrer dans le secteur
	 * @return int
	 */
	count: function() {
		return this._objects.length;
	},

	/** Renvoie l'objet désigné par son rang */
	get: function(i) {
		return this._objects[i] || null;
	},

	/** Renvoie les objets qui collisione avec l'objet spécifié */
	collides : function(oObject) {
		var oShape = oObject.shape();
		return this._objects
			.filter(o => 
				o != oObject && 
				oShape.hits(o.shape())
			);
	}
});

O2.mixin(Fairy.Sector, O876.Mixin.Prop);
