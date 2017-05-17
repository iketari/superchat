import {deepEqual} from '../framework/utils';
import {Emitter} from '../framework/emitter';

export class ChatService {

	constructor ({baseUrl, pollingInterval = 15000, http}) {
		Emitter.apply(this);

		this.pollingInterval = pollingInterval;
		this.http = http;

		this.http.setBaseUrl(baseUrl);

		this.__messages = [];
		this.__pollingID = null;
		this.__lastReqTime = null;
	}

	getMessages () {
		return this.http.makeRequest()
			.then(resp => Object.values(resp.data));
	}

	sendMessage (data) {
		data.date = Date.now();

		return this.http.makeRequest('POST', data)
			.then(resp => resp.data);
	}

	startPolling () {
		let doRequest = () => {
			this.getMessages().then(messages => {
				this.setMessages(messages);
				this.__pollingID = setTimeout(doRequest, this.pollingInterval);
			});
		};

		doRequest();
	}

	stopPolling () {
		clearInterval(this.__pollingID);
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
		return new this(...rest);
	}

}
