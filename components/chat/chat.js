(function () {
	'use strict';

	/**
	 * @typedef {Object} ChatMessage
	 *
 	 * @property {string} text - Текст сообщения
 	 * @property {string} email - Email отправителя сообщения
	 */

	class Chat {
		constructor({el, data = {messages: []}}) {
			this.el = el;
			this.data = data;

			this._getUserName();
		}

		render () {
			this.el.innerHTML = `
			<div class="chat">
				<div class="chat__container">
				  <div class="header">
				    <h2>Чат</h2>
				  </div>
				  <div class="chat__box">
				    ${this._generateMessages()}
				  </div>
				</div>
			</div>
			`;
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

		_getUserName () {
			//TODO: справшивать
			this.data.user = 'Tim';
		}

		_generateMessages () {
			let data = this.data.messages || [];

			if (!data.length) {
				return `<h3>Сообщений нет</h3>`;
			}

			return data.map(item => {
				return `
					<div class="message-box left-img">
						<div class="picture">
							<img src="${item.avatar}" title="user name"/>
							<span class="time">${item.date.toTimeString().split(' ')[0]}</span>
						</div>
						<div class="message">
							<span>${item.name}</span>
							<p>${item.text}</p>
						</div>
					</div>
				`;
			});
		}
	}


	//export
	window.Chat = Chat;
})();