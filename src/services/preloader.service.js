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
class PreloaderService {
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

}

export default new PreloaderService();
