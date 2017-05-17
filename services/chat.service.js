export class ChatService {

	constructor ({baseUrl, pollingInterval = 2000, http}) {
		this.pollingInterval = pollingInterval;
		this.http = http;

		this.http.setBaseUrl(baseUrl);

		this.__pollingID = null;
		this.__lastReqTime = null;
	}

	getMessages (cb) {
		this.http.makeRequest().then(resp => cb(Object.values(resp.data)));
	}

	sendMessage (data, cb) {
		data.date = Date.now();
		this.http.makeRequest('POST', data).then(resp => {
			cb(resp.data);
		});
	}

	startPolling () {

		let chatService = this;

		function doRequest () {
			let reqTime = Date.now();

			if (chatService.__stopped) {
				return;
			}

			if (reqTime - chatService.__lastReqTime > chatService.pollingInterval ||
				!chatService.__lastReqTime) {
				// chatService.getMessages(messages => {
					chatService.trigger('messages', messages);
					chatService.__lastReqTime = Date.now();
				// });
			}

			requestAnimationFrame(doRequest);
		};

		requestAnimationFrame(doRequest);
	}

	stopPolling () {
		clearInterval(this.__pollingID);
	}

	/**
	 * Dispatch an event on this object
	 * @param {string} name event name
	 * @param {any} data event payload
	 */
	trigger (name, data) {
		if (this.__callbacks && this.__callbacks[name]) {
			this.__callbacks[name].forEach(cb => cb.call(this, data));
		}
	}

	/**
	 * Subscribe on event
	 * @param {string} name event name
	 * @param {function} cb callback
	 */
	on (name, cb) {
		if (!this.__callbacks) {
			this.__callbacks = {};
		}

		if (!this.__callbacks[name]) {
			this.__callbacks[name] = [];
		}

		this.__callbacks[name].push(cb);
	}

	/**
	 * Get instance of this class
	 * @static 
	 */
	static getInstance (...rest) {
		return new this(...rest);
	}

}
