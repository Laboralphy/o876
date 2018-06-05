/**
 * Created by ralphy on 07/09/17.
 */

const SB = require('./SpellBook');
/**
 * this class is similar to the node.js Emitter system
 * it emits events
 * client instances may instanciate this class and call methods such as
 * .on  to defines an event handler
 * .off to undefined an event handler
 * .one to define a "one triggered" handler
 * .trigger to cast an event
 *
 * Only usefull in javascript, as node.js is provided with the "events" module.
 */


module.exports = class Emitter {
    constructor() {
        this._oEventHandlers = {};
    }

    /**
	 * triggers an event
	 * @param sEvent {string} event name
	 * @param params {*} any parameter that will transmitted to the handler
     * @return {*}
     */
    trigger(sEvent, params) {
        let aArgs = SB.array(arguments);
        aArgs.shift();
        let eh = this._oEventHandlers;
        if (sEvent in eh) {
			eh[sEvent].one.forEach(f => f.apply(this, aArgs));
			eh[sEvent].one = [];
            eh[sEvent].on.forEach(f => f.apply(this, aArgs));
        }
		return this;
    }

    /**
	 * A private helper to define a handler
     * @param sEvent {string}
     * @param sType {string}
     * @param pHandler {function}
     * @private
     */
	_define(sEvent, sType, pHandler) {
		let eh = this._oEventHandlers;
		if (!(sEvent in eh)) {
			eh[sEvent] = {
			    on: [],
                one: []
            };
		}
		eh[sEvent][sType].push(pHandler);
	}

    /**
	 * a private method to undefined an event
     * @param sEvent {string}
     * @param sType {string}
     * @param pHandler ({function})
     * @private
     */
	_undefine(sEvent, sType, pHandler) {
		let eh = this._oEventHandlers;
		if (!(sEvent in eh)) {
			return;
		}
		eh = eh[sEvent];
		if (!(sType in eh)) {
			return;
		}
		if (pHandler) {
			eh[sType] = eh[sType].filter(h => h !== pHandler);
        } else {
			eh[sType] = [];
        }
	}

    /**
	 * Defines an event handler, that will be invoked each time the event is triggered
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	on(sEvent, pHandler) {
		this._define(sEvent, 'on', pHandler);
		return this;
	}

    /**
     * Defines an event handler, that will be invoked only the next time
	 * the event will be triggered
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	one(sEvent, pHandler) {
		this._define(sEvent, 'one', pHandler);
		return this;
	}

    /**
	 * unload event handlers
     * @param sEvent {string}
     * @param pHandler {function}
     * @return {Emitter}
     */
	off(sEvent, pHandler) {
        switch (SB.typeMap(arguments)) {
            case 's': // turn off handler
				this._undefine(sEvent, 'on');
				this._undefine(sEvent, 'one');
				break;

            case 'sf':
				this._undefine(sEvent, 'on', pHandler);
				this._undefine(sEvent, 'one', pHandler);
				break;
        }
		return this;
	}
};