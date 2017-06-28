/**
 * This provides methods used for event handling. It's not meant to
 * be used directly.
 * @module {Emitter} Emitter
 * 
 * @mixin Emitter
 */
export default function Emitter () {
	/**
	 * Fire an event, causing all handlers for that event name to run.
	 * @param {string} name event name
	 * @param {*} data event payload
	 * @lends Emitter
	 */
	this.trigger = function (name, data) {
		if (this[Emitter.symbol][name]) {
			this[Emitter.symbol][name].forEach(cb => cb.call(this, data));
		}
	};

	/**
	 * Register a handler function to be called whenever this event is fired.
	 * @param {string} name event name
	 * @param {function} cb callback
	 * @lends Emitter
	 */
	this.on = function (name, cb) {
		if (!this[Emitter.symbol][name]) {
			this[Emitter.symbol][name] = [];
		}

		this[Emitter.symbol][name].push(cb);
	};
}

/**
 * Link for symbol for storign callbacks
 * @static
 */
Emitter.symbol = Symbol.for('emitter:callbacks');

/**
 * Method for apply mixin to the recipient
 * @static 
 * @param {*} recipient - object to install functionality
 */
Emitter.apply = function (recipient) {
	if (!recipient[Emitter.symbol]) {
		recipient[Emitter.symbol] = {};
	}

	Function.prototype.apply.call(Emitter, recipient);
}