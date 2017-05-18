/**
 * @module {Emitter} Emitter
 * @mixin Emitter
 */
export function Emitter () {

    /**
	 * Вызов обработчиков событий
	 * @param {string} name event name
	 * @param {*} data event payload
     * @lends Emitter
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
	 * @lends Emitter
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