import {deepEqual} from '../framework/utils';
import {Emitter} from '../framework/emitter';

export new class ChatService {

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

	setUserName (name) {
		this._username = name;
	}

	getUserName () {
		return this._username;
	}

	getMessages () {
		return this.http.makeRequest()
			.then(resp => Object.values(resp.data));
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
		if (deepEqual(this._messages, messages)) {
			return;
		}

		this._messages = messages;
		this.trigger('messages', this._messages);
	}

	/**
	 * Get instance of this class
	 * @static 
	 */
	static getInstance (...rest) {
		if (!this.__instance) {
			this.__instance = new this(...rest);
		}

		return this.__instance;
	}

}
