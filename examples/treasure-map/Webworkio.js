/**
 * This class will help creating service worker
 * This class is use in both worker-side and script-side
 *
 *
 */
const EventManager = require('events');

class Webworkio {

	constructor() {
		this._callbacks = {};
		this._bLog = false;
		this._callbackLastId = 0;
		this._worker = null;
		this._eventManager = new EventManager();
	}

	verbose() {
	    this._bLog = true;
    }

	static _encode(x) {
		return x;
	}

	static _decode(x) {
		return x;
	}

	/**
	 * si un paramètre (w est spécifié : Déclare cette instance en tant que qu'utilisatrice de service
	 * sinon : déclare cette instance en tant que service
	 * Initialise l'écouteur de message en fonction du contexte sélectionné
	 * @param [w] {string} nom du service à utiliser
	 */
	service(w) {
		if (w) {
			this._worker = new Worker(w);
			this._worker.addEventListener('message', event => this.messageReceived(Webworkio._decode(event.data)));
		} else {
			addEventListener('message', event => this.messageReceived(Webworkio._decode(event.data)));
		}
	}


	registerCallback(callback) {
		this._callbacks[++this._callbackLastId] = callback;
		return this._callbackLastId;
	}

	invokeCallback(id, data) {
		this.log('invoking callback id', id);
		if (id in this._callbacks) {
			let cb = this._callbacks[id];
			delete this._callbacks[id];
			cb(data);
		} else {
			if (id < this._callbackLastId) {
				throw new Error('this callback id has expired')
			} else {
				throw new Error('this callback has invalid id that has never been used');
			}
		}
	}

	on(...args) {
		this._eventManager.on(...args);
	}

	/**
	 * Transmission d'info à l'interlocuteur
	 */
	emit(sEvent, data, callback) {
		let packet = Object.assign({}, data, {__event: sEvent});
		if (callback) {
			packet.__callback = this.registerCallback(callback);
		}
		this.log('emitting message', sEvent, packet);
		if (this._worker) {
			this._worker.postMessage(Webworkio._encode(packet));
		} else {
			postMessage(Webworkio._encode(packet));
		}
	}

	log(...args) {
		if (this._bLog) {
		    console.log(!!this._worker ? '[window]' : '[service]', ...args);
        }
	}

	messageReceived(data) {
		this.log('message received', data);
		let sEvent = data.__event;
		let idCallback = data.__callback;
		let idResponse = data.__response;

		delete data.__event;
		delete data.__callback;
		delete data.__response;
		if (idCallback) {
			this._eventManager.emit(sEvent, data, result => {
				this.log('response', sEvent, 'callback', idCallback, result);
				this.emit(sEvent, Object.assign(result, {__response: idCallback}));
			});
		} else if (idResponse) {
			this.invokeCallback(idResponse, data);
		} else {
			this._eventManager.emit(sEvent, data);
		}
	}
}

module.exports = Webworkio;