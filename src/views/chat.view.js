import BaseView from '../framework/view';

import Chat from '../components/chat/chat';
import Form from '../components/form/form';
import AvatarService from '../services/avatar.service';
import ChatService from '../services/chat.service';
import HttpService from '../services/http.service';
import firebaseService from '../services/firebase.service';


const chatService = ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: HttpService.getInstance(),
	pollingInterval: 1000
});

const avatarService = AvatarService.getInstance();

/**
 * @class ChatView
 */
export default class ChatView extends BaseView {
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

	render ({scroll} = {}) {
		this.chat.render({scroll});
		this.form.render();
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
							class: 'form__control_secondary logout',
							href: '/main',
						}
					}
				]
			}
		});

		this.el.appendChild(this.chat.el);
		this.el.appendChild(this.form.el);
	}

	_initMediate () {
		this.form.on('submit', (formData) => {
			chatService.sendMessage({
				text: formData.message
			});

			this.chat.setScrollStrategy('bottom');
			this.form.reset();
		});

		this.el.addEventListener('click', this._onClick.bind(this));
		this.el.addEventListener('mousewheel', this._onMouseWheel.bind(this));
	}

	addMessage (data) {
		this.chat.addOne(data);
	}

	_onMouseWheel () {
		this.chat.setScrollStrategy('fixed');
	}

	_onClick (event) {
		if (event.target.classList.contains('logout')) {
			event.preventDefault();
			event.isRoutingPrevented = true;
			firebaseService.logOut();
		}
	}
}
