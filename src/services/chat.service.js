/**
 * Service which provides the chat functionality.
 * Makes possible to send and poll messages.
 * @module {ChatService} ChatService
 */

import {deepEqual} from '../framework/utils';
import Emitter from '../framework/emitter';

import filter from '../modules/html-filter';


/**
 * @class ChatService
 * @alias module:ChatService
 * @mixes Emitter
 */
export default class ChatService {
	/**
	 * @private
	 * @constructor
	 * @param {Object}
	 */
	constructor ({baseUrl, pollingInterval = 15000, http}) {
		Emitter.apply(this);

		this.pollingInterval = pollingInterval;
		this.http = http;

		this.http.setBaseUrl(baseUrl);

		this._messages = [];
		this._pollingID = null;
		this._stopped = false;
		this._username = 'anonimus';
	}

	/**
	 * @method setUserName
	 * @public
	 * @param {string} name - set username field
	 */
	setUserName (name) {
		this._username = name;
		this.trigger('username:change', {name});
	}


	getUserName () {
		return this._username;
	}

	getMessages () {
		return this.http.makeRequest()
			.then(resp => Object.values(resp.data || {}));
	}

	sendMessage (data) {
		data.date = Date.now();
		data.name = this._username;

		return this.http.makeRequest('POST', data)
			.then(resp => resp.data);
	}

	startPolling () {
		this._stopped = false;

		let doRequest = () => {
			if (this._stopped) {
				return;
			}

			this.getMessages().then(messages => {
				this.setMessages(messages);
				this._pollingID = setTimeout(doRequest, this.pollingInterval);
			});
		};

		doRequest();
	}

	stopPolling () {
		clearInterval(this._pollingID);
		this._stopped = true;
	}

	setMessages (messages) {
		messages = messages
			.map(message => {
				if (message.html) {
					message.text = filter(message.text, ['em', 'strong']);
				}
				return message;
			});

		if (deepEqual(this._messages, messages)) {
			return;
		}

		this._messages = messages;
		this.trigger('messages', this._messages);
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
