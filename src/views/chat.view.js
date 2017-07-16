import BaseView from '../framework/view';

import Chat from '../components/chat/chat';
import Form from '../components/form/form';
import AvatarService from '../services/avatar.service';
import ChatService from '../services/chat.service';
import HttpService from '../services/http.service';


const chatService = ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: HttpService.getInstance(),
	pollingInterval: 1000
});

const avatarService = AvatarService.getInstance();

export default class ChatView extends BaseView {
	constructor (...rest) {
		super(...rest);
	}

	show () {
		this.chat.setUserName(chatService.getUserName());
		this.render();
		chatService.startPolling();

		super.show();
	}

	hide () {
		chatService.stopPolling();

		super.hide();
	}

	render () {
		this.chat.render();
		this.form.render();

		this.el.appendChild(this.chat.el);
		this.el.appendChild(this.form.el);
	}

	_createComponents () {
		this.chat = new Chat({
			el: document.createElement('div'),
			avatarService,
			chatService
		});

		this.form = new Form({
			el: document.createElement('div'),
			data: {
				widgets: [
					{
						tag: 'textarea',
						attributes: {
							name: 'message',
							placeholder: 'Введите сообщение...'
						}
					},
					{
						tag: 'input',
						attributes: {
							class: 'form__control',
							type: 'submit',
							value: 'Отправить'
						}
					},
					{
						tag: 'a',
						inner: 'Выйти',
						attributes: {
							class: 'form__control_secondary',
							href: '/main',
						}
					}
				]
			}
		});
	}

	_initMediate () {
		this.form.on('submit', (formData) => {
			let data = {
				text: formData.message
			};

			chatService.sendMessage(data);

			this.render();
		});
	}

	addMessage (data) {
		this.chat.addOne(data);
	}
}
