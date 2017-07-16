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
	constructor() {
		Emitter.apply(this);

		this.store = new Store('settings');
		this.settings = {
			html: false,
			sendKeys: SettingsService.SEND_KEYS.ENTER,
		};
		this.settings.html = this.store.getItem('html') || false;
		let sendKeysFromStore = this.store.getItem('sendKeys');
		if ([SettingsService.SEND_KEYS.ENTER, SettingsService.SEND_KEYS.ALT_ENTER].includes(sendKeysFromStore)) {
			this.settings.sendKeys = sendKeysFromStore;
		} else {
			this.settings.sendKeys = SettingsService.SEND_KEYS.ENTER;
		}

		this.store.on('change', this._settingsChanged.bind(this));
	}

	_settingsChanged({name, oldValue, newValue}) {
		switch (name) {
		case 'html': {
			this.settings.html = newValue;
			this.trigger('change-settings:html', {name, oldValue, newValue});
			break;
		}
		case 'sendKeys': {
			this.settings.sendKeys = newValue;
			this.trigger('change-settings:sendKeys', {name, oldValue, newValue});
			break;
		}
		}
	}

	allowHtmlUsage() {
		this.store.setItem('html', true);
	}

	disallowHtmlUsage() {
		this.store.setItem('html', false);
	}

	setSendMessageKeys(keys) {
		this.store.setItem('sendKeys', keys);
	}

	/**
	 * @enum
	 * @return {{ENTER: string, ALT_ENTER: string}}
	 * @constructor
	 */
	static get SEND_KEYS() {
		return {
			'ENTER': 'Enter',
			'ALT_ENTER': 'Alt + Enter'
		};
	}

	/**
	 * Getting an instance of the class
	 * @return {SettingsService}
	 */
	static getInstance(...rest) {
		if (!this.__instance) {
			this.__instance = new this(...rest);
		}

		return this.__instance;
	}
}
