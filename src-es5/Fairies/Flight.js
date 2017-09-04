/**
 * O876 Fairies Sprite Engine
 * Flight
 * Cette classe vise à gérer les mouvement des mobile
 * On peut adjoindre des composante nomméees Wings
 * Chaque Wing à pour but d'agir sur un aspect du mouvement
 * Les instance de flight sont là pour gérer les execution des wings
 */
O2.createClass('Fairy.Flight', {
	_position: null,	// Position du mobile
	_wings: null,		// Collection de Fairy.Wing
	_forces: null,		// Collection des forces qui agissent sur le mouvement
	_speed: null,		// Dernière vitesse calculée. Ce vecteur permet de conserver le mouvement
						// lors les forces externent disparaissent

	oWingRegistry: null,
	

	__construct: function() {
		this._position = new Fairy.Vector(0, 0);
		this._wings = [];
		this._forces = [];
		this._speed = new Fairy.Vector()
		this.oWingRegistry = {};
	},

	/**
	 * Effectue la somme des vecteur force
	 * @return Fairy.Vector
	 */
	_applyForces: function() {
		var v = this._speed;
		var vs = this._forces;
		while (vs.length) {
			v.trans(vs.shift());
		}
		this.move(v);
	},

	/**
	 * Assigner ou obtenir une instance Wing
	 * @param w instance wing ou paramètre de recherche
	 * @param sId identifiant de wing optionel
	 * @return this ou instance wing
	 */
	wing: function(w, sId) {
		switch (typeof w) {
			case 'undefined':
				return this;

			case 'object':
				this.wings().push(w);
				if (sId) {
					this.oWingRegistry[sId] = w;
				}
				return this;

			case 'string':
				return this.oWingRegistry[w];

			case 'number':
				return this.wings()[w];
		}
	},

	/**
	 * Effectue le déplacement forcé du mobile
	 * @param v vecteur de déplacement souhaité
	 */
	move: function(v) {
		this._position.trans(v);
	},
	
	/** 
	 * Exécute la méthoe flap() de chaque instance de la collection de wings
	 */
	flap: function(oMobile, nTime) {
		this._wings.forEach(function(w) {
			w.flap(oMobile, nTime);
		});
		this._applyForces();
		return this;
	}
});

O2.mixin(Fairy.Flight, O876.Mixin.Prop);
