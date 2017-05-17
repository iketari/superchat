export function Emitter () {

    /**
	 * Dispatch an event on this object
	 * @param {string} name event name
	 * @param {any} data event payload
	 */
	this.trigger = function (name, data) {
		if (this.__callbacks && this.__callbacks[name]) {
			this.__callbacks[name].forEach(cb => cb.call(this, data));
		}
	};

	/**
	 * Subscribe on event
	 * @param {string} name event name
	 * @param {function} cb callback
	 */
	this.on = function (name, cb) {
		if (!this.__callbacks) {
			this.__callbacks = {};
		}

		if (!this.__callbacks[name]) {
			this.__callbacks[name] = [];
		}

		this.__callbacks[name].push(cb);
	};
}