/**
 * Configurational service.
 * Provides an actual config according to current value of the ENV variable.
 * @module {ChatService} ChatService
 * @see webpack/production.confing.js
 */

import { Service } from '../../framework/service';
import { config } from './config.development';

/**
 * @class ChatService
 * @alias module:ChatService
 * @mixes Emitter
 */
export class ConfigService extends Service {
	/**
	 * @private
	 * @constructor
	 */
	constructor(...args) {
		super(...args);
	}

	/**
     * Returns a value. If value doesn't exist returns null;
     * @param {string} key
     * @returns {*}
     */
	get(key = '') {
		const keys = key.split('.');
		let value = config;

		for (let subKey of keys) {
			if (value[subKey] === undefined) {
				return null;
			} else {
				value = value[subKey];
			}
		}

		return value;
	}
}

export default new ConfigService();
