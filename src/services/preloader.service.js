/**
 * Service for managing the preloader
 * @module {PreloaderService} PreloaderService
 */

import Emitter from '../framework/emitter';

/**
 * @class PreloaderService
 * @alias module:PreloaderService
 * @mixes Emitter
 */
export default class PreloaderService {
	/**
	 * @private
	 * @constructor
	 */
	constructor() {
		Emitter.apply(this);

		this.preloader = document.getElementById('preloader-wrapper');
	}

	hide() {
		this.preloader.removeAttribute('state');
		document.body.removeAttribute('preloader');
	}

	show() {
		this.preloader.setAttribute('state', 'active');
		document.body.setAttribute('preloader', 'active');
	}

	/**
	 * Getting an instance of the class
	 * @return {PreloaderService}
	 */
	static getInstance(...rest) {
		if (!this.__instance) {
			this.__instance = new this(...rest);
		}

		return this.__instance;
	}
}
