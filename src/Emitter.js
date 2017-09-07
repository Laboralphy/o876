/**
 * Created by ralphy on 07/09/17.
 */


import SB from './SpellBook.js';


export default class Emitter {
    constructor() {
        this._oEventHandlers = {};
        this._oInstance = null;
    }

    instance(oInst) {
        if (oInst === undefined) {
            return this._oInstance;
        } else {
			this._oInstance = oInst;
            return this;
        }
    }

    trigger() {
        let aArgs = SB.array(arguments);
        let sEvent = aArgs.shift();
        let eh = this._oEventHandlers;
        if (sEvent in eh) {
			eh[sEvent].one.forEach(f => f.apply(this._oInstance, aArgs));
			eh[sEvent].one = [];
            eh[sEvent].on.forEach(f => f.apply(this._oInstance, aArgs));
        }
		return this.instance();
    }

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
		return;
	}

	on(sEvent, pHandler) {
		this._define(sEvent, 'on', pHandler);
		return this;
	}

	one(sEvent, pHandler) {
		this._define(sEvent, 'one', pHandler);
		return this;
	}

	off() {
        switch (SB.typeMap(arguments)) {
            case 's': // turn off handler
				this._undefine(arguments[0], 'on');
				this._undefine(arguments[0], 'one');
				break;

            case 'sf':
				this._undefine(arguments[0], 'on', arguments[1]);
				this._undefine(arguments[0], 'one', arguments[1]);
				break;
        }
		return this;
	}
}