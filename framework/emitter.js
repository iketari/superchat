export function Emitter () {

    /**
	 * Вызов обработчиков событий
	 * @param {string} name event name
	 * @param {*} data event payload
	 */
	this.trigger = function (name, data) {
		if (this.__callbacks && this.__callbacks[name]) {
			this.__callbacks[name].forEach(cb => cb.call(this, data));
		}
	};

	/**
	 * Регистрация обработчика события
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