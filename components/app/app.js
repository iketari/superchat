(function () {
	'use strict';

	//import
	const Chat = window.Chat;
	const Form = window.Form;

	class App {
		constructor({el}) {
			this.el = el;

			this._createComponents();
			this._initMediate();

			this.el.appendChild(this.chat.el);
			this.el.appendChild(this.form.el);

			this.render();
		}

		render () {
			this.chat.render();
			this.form.render();
		}

		_createComponents () {
			this.chat = new Chat({
				el: document.createElement('div')
			});

			this.form = new Form({
				el: document.createElement('div')
			});
		}

		_initMediate () {
			this.form.onSubmit((data) => {
				let sendData = {
					text: data.message.value,
					user: data.username.value
				}

				makeRequest((data) => { // отправить сообщение
					this.chat.render();

					makeRequest(chatData => { // забрать сообщения
						let messages = Object.values(chatData);

						this.chat.setMessages(messages);
						this.chat.render();
					});

				}, sendData, 'POST');

				this.form.reset();
			});
		}
	
		// methods
	}

	//export
	window.App = App;
})();