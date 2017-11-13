/**
 * A base for any service in the project
 * Each service should be inherited from this module
 * @module {Service} Service
 */

/**
 * @class {Service}
 * @alias module:Service
 */
export default class Service {

	/**
	 * @constructor
	 * @param {Object} settings 
	 */
	constructor (settings) {
		if (!Service.__instance) {
			Service.__instance = this;
		} else {
			throw new Error('There is an instance of this services has been instantiated already');
		}

		this._settings = settings;
	}

	/**
	 * Updates the settings of the service
	 * @param {Object|string} settings
	 * @param {*|undefined} value 
	 */
	config (settings, value) {
		if (typeof value != 'undefined') {
			settings = {
				[settings]: value
			};
		}

		Object.assign(this._settings, settings);
	}

	/**
	 * Getting an instance of the Service
	 * @return {Service}
	 */
	static getInstance(...rest) {
		if (!this.__instance) {
			this.__instance = new this(...rest);
		}

		return this.__instance;
	}
}