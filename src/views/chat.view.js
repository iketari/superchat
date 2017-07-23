import BaseView from '../framework/view';

import Chat from '../components/chat/chat';
import Form from '../components/form/form';
import AvatarService from '../services/avatar.service';
import ChatService from '../services/chat.service';
import HttpService from '../services/http.service';
import firebaseService from '../services/firebase.service';
import SettingsService from '../services/settings.service';


const httpService = HttpService.getInstance();
const avatarService = AvatarService.getInstance();
const settingsService = SettingsService.getInstance();

const chatService = ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: httpService,
	pollingInterval: 1000
});

/**
 * @class ChatView
 */
export default class ChatView extends BaseView {
	show () {
		this.chat.setUserName(chatService.getUserName());
		this.render();

		const token = sessionStorage.getItem('token');
		if (token) {
			httpService.setToken(token);
			chatService.startPolling();
		} else {
			this.router.go('/login');
			return;
		}

		super.show();
	}

	hide () {
		chatService.stopPolling();

		super.hide();
	}

	render ({scroll} = {}) {
		this.chat.render({scroll});
		this.form.render();

		const sendButton = this.form.formEl.querySelector('input.form__control');
		if (sendButton) {
			const span = document.createElement('span');
			span.classList.add('form__control-helper');
			sendButton.parentNode.appendChild(span);

			const settingsChangedCallback = function () {
				console.log(settingsService.settings);
				span.innerHTML = `Send messages by ${settingsService.settings.sendKeys}<br />Line break by ${settingsService.settings.sendKeys === SettingsService.SEND_KEYS.ALT_ENTER ? SettingsService.SEND_KEYS.ENTER : SettingsService.SEND_KEYS.ALT_ENTER}`;
			};

			settingsService.on('change-settings:sendKeys', settingsChangedCallback);
			settingsChangedCallback();
		}
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
							required: true,
							name: 'message',
							placeholder: 'Enter message...'
						}
					},
					{
						tag: 'input',
						attributes: {
							class: 'form__control',
							type: 'submit',
							value: 'Send'
						}
					},
					{
						tag: 'a',
						inner: 'Log out',
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
				text: formData.message,
				html: settingsService.settings.html
			});

			this.chat.setScrollStrategy('bottom');
			this.form.reset();
		});

		chatService.on('username:change', ({name}) => {
			this.chat.setUserName(name);
			this.chat.render();
		});

		chatService.on('messages', messages => {
			this.chat.setMessages(messages);
			this.chat.render();
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

			firebaseService.logOut().then( _ => {
				sessionStorage.removeItem('token');
				this.router.go('/main');
			});
		}
	}
}
