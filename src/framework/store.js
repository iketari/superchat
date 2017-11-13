/**
 * A data store based on localStorage
 * Supports subscribing to data change events
 * @module {Store} Store
 */

import Emitter from './emitter';
import { deepEqual } from './utils';

const stores = {};

/**
 * @class Store
 * @alias module:Store
 * @mixes Emitter
 */
export default class Store {
	/**
	 * @constructor
	 * @param {String} [scope='default'] - store scope
	 */
	constructor(scope = 'default') {
		if (typeof stores[scope] !== 'undefined') {
			return stores[scope];
		}

		Emitter.apply(this);

		this.scope = scope;

		stores[scope] = this;
	}

	/**
	 * Get item value
	 * @param {String} name
	 * @return {*|null}
	 */
	getItem(name) {
		const key = `${this.scope}.${name}`;
		let item = window.localStorage.getItem(key);

		if (typeof item === 'undefined') {
			return null;
		}

		try {
			item = JSON.parse(item);
		} catch (_) {
			// ignore
		}

		return item;
	}

	/**
	 * Returns all stored values (in this scope) in one big object
	 * @return {{}}
	 */
	getAll() {
		const testRegex = new RegExp(`^${this.scope}\\..+`);
		const replaceRegex = new RegExp(`^${this.scope}\\.`);
		const returned = {};
		for (const key of Object.keys(window.localStorage)) {
			if (!testRegex.test(key)) {
				continue;
			}

			let value = window.localStorage.getItem(key);
			try {
				value = JSON.parse(value);
			} catch (_) {
				// ignore
			}
			const name = key.replace(replaceRegex, '');

			returned[name] = value;
		}

		return returned;
	}

	/**
	 * Set item value
	 * @param {String} name
	 * @param {*} value
	 * @return {boolean} - true if success
	 */
	setItem(name, value) {
		const key = `${this.scope}.${name}`;
		let oldValue = window.localStorage.getItem(key);

		try {
			oldValue = JSON.parse(oldValue);
		} catch (_) {
			// ignore
		}

		const setted = Store.toString(value);
		let newValue = JSON.parse(setted);

		window.localStorage.setItem(key, setted);

		if (!deepEqual(oldValue, newValue)) {
			this.trigger('change', {
				key,
				name,
				oldValue,
				newValue,
				scope: this.scope
			});
		}

		return true;
	}

	/**
	 * Remove some value from store
	 * @param {String} name
	 * @return {boolean} - true if success
	 */
	removeItem(name) {
		const key = `${this.scope}.${name}`;
		let oldValue = window.localStorage.getItem(key);

		if (typeof oldValue === 'undefined') {
			return false;
		}

		try {
			oldValue = JSON.parse(oldValue);
		} catch (_) {
			// ignore
		}
		let newValue = null;

		window.localStorage.removeItem(key);
		if (!deepEqual(oldValue, newValue)) {
			this.trigger('change', {
				key,
				name,
				oldValue,
				newValue,
				scope: this.scope
			});
		}

		return true;
	}

	/**
	 * Clear store
	 */
	clear() {
		const testRegex = new RegExp(`^${this.scope}\\..+`);
		const replaceRegex = new RegExp(`^${this.scope}\\.`);
		const events = [];
		for (const key of Object.keys(window.localStorage)) {
			if (!testRegex.test(key)) {
				continue;
			}
			let oldValue = window.localStorage.getItem(key);
			try {
				oldValue = JSON.parse(oldValue)
			} catch (_) {
				// ignore
			}
			window.localStorage.removeItem(key);
			let newValue = null;
			if (!deepEqual(oldValue, newValue)) {
				events.push({
					key,
					name: key.replace(replaceRegex, ''),
					oldValue,
					newValue,
					scope: this.scope,
				});
			}
		}

		events.forEach(event => this.trigger('change', event));
	}

	static toString(value) {
		if (['number', 'boolean', 'string'].includes(typeof value)) {
			return JSON.stringify(value);
		}

		if (value !== null && typeof value === 'object' && value.constructor === Object) {
			return JSON.stringify(value)
		}

		throw new Error('Non valid value');
	}
}

window.addEventListener('storage', function (e) {
	let {key, oldValue, newValue} = e;
	let scope = key.split('.')[0];

	if (typeof stores[scope] === 'undefined') {
		return;
	}

	const store = stores[scope];

	try {
		oldValue = JSON.parse(oldValue)
	} catch (_) {
		// ignore
	}

	try {
		newValue = JSON.parse(newValue)
	} catch (_) {
		// ignore
	}

	const replaceRegex = new RegExp(`^${scope}\\.`);
	const name = key.replace(replaceRegex, '');

	if (!deepEqual(oldValue, newValue)) {
		store.trigger('change', {
			key,
			name,
			oldValue,
			newValue,
			scope
		});
	}
});
