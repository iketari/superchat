/**
 * Service for working with settings
 * @module {SettingsService} SettingsService
 */

import Emitter from '../framework/emitter';
import Store from '../framework/store';

/**
 * @class SettingsService
 * @alias module:SettingsService
 * @mixes Emitter
 */
export default class SettingsService {
	/**
	 * @private
	 * @constructor
	 */
	constructor () {
		Emitter.apply(this);
	}

	/**
	 * Getting an instance of the class
	 */
	static getInstance (...rest) {
		if (!this.__instance) {
			this.__instance = new this(...rest);
		}

		return this.__instance;
	}
}
