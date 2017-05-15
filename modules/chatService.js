(function () {
	'use strict';

	class ChatService {

		constructor ({baseUrl}) {
			this.baseUrl = baseUrl;
		}

		_makeRequest (cb, type = 'GET', data = {}) {
			let xhr = new XMLHttpRequest();
			xhr.open(type, this.baseUrl, true);

			xhr.onload = () => {
				cb(JSON.parse(xhr.responseText));
			};

			xhr.send(JSON.stringify(data));
		}

		getMessages (cb) {
			this._makeRequest(messages => cb(Object.values(messages)));
		}

		sendMessage (data, cb) {
			data.date = Date.now();
			this._makeRequest(cb, 'POST', data);
		}
	
	}

	//export
	window.ChatService = ChatService;
})();