/**
 * @class Fairy.Wing
 *
 * this class is an abstract.
 * the method flap() is use to provide modification of
 * the given mobile
 */
O2.createClass('Fairy.Wing', {
    /**
     * @constructor
     */
	__construct: function() {
	},

    /**
	 * provides modifications on the given mobile
     * @param oMobile {Fairy.Mobile}
     */
	flap: function(oMobile) {
	}
});


O2.mixin(Fairy.Wing, O876.Mixin.Prop);
