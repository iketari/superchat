/**
 * Configurational service.
 * Provides an actual config according to current value of the ENV variable.
 * @module {ChatService} ChatService
 * @see webpack.confing.js
 */


/**
 * @class ChatService
 * @alias module:ChatService
 * @mixes Emitter
 */
export default class ChatService {
	/**
	 * @private
	 * @constructor
	 */
    constructor() {}

    /**
     * Returns a value. If value doesn't exist returns null;
     * @param {string} key
     * @returns {*}
     */
    get (key = '') {
        keys = key.split('.');
        let value = data;

        for (let subKey in keys) {
            value = value[subKey] ? value[subKey] : null;
        }

        return value;
    }

	/**
	 * Getting an instance of the class
	 */
    static getInstance(...rest) {
        if (!this.__instance) {
            this.__instance = new this(...rest);
        }

        return this.__instance;
    }
}
