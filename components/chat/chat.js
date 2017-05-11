(function () {
	'use strict';

	//import
	const tmpl = window.chatTmpl;

	/**
	 * @typedef {Object} ChatMessage
	 *
 	 * @property {string} text - Текст сообщения
 	 * @property {string} user - имя отправителя сообщения
	 */

	class Chat {
		constructor({el, data = {messages: []}}) {
			this.el = el;
			this.data = data;

			this.data.user = 'Tim';
		}

		render () {
			this.el.innerHTML = tmpl(this.data);
		}

		/**
		 * Добавить новое сообщение в чат
		 * @param {ChatMessage} data
		 */
		addMessage (data) {
			this.data.messages.push({
				avatar: 'http://i.imgur.com/FHMnsVNt.jpg',
				name: data.name || this.data.user,
				text: data.text,
				date: data.date || new Date()
			});
		}

		/**
		 * Установить сообщения
		 * @param {ChatMessage[]} name description
		 */
		setMessages (messages) {
			this.data.messages = messages.map(item => ({
				avatar: 'http://i.imgur.com/FHMnsVNt.jpg',
				name: item.user,
				text: item.text,
				date: item.date || new Date()
			}));
		}

		getUserName () {
			//TODO: справшивать
			return this.data.user;
		}
	}


	//export
	window.Chat = Chat;
})();