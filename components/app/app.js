import './app.css';

import {Chat} from '../chat/chat';
import {Form} from '../form/form';
import {AvatarService} from '../../modules/avatarService';
import {ChatService} from '../../modules/chatService';


const chatService = new ChatService({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json'
});

class App {

	constructor(options) {
		this.el = options.el;

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
			el: document.createElement('div'),
			avatarService: new AvatarService(),
			chatService,
			data: {
				messages: [],
				user: null
			}
		});

		this.form = new Form({
			el: document.createElement('div')
		});
	}

	_initMediate () {

		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'hidden') {
				this.chat.stopPolling();
			} else {
				this.chat.stopPolling();
				this.chat.startPolling();
			}
		});

		this.form.on('message', (event) => {
			let data = event.detail;

			if (event.detail.username.value) {
				this.chat.setUserName(event.detail.username.value);
			}

			data = {
				text: data.message.value,
				name: this.chat.getUsername()
			};

			chatService.sendMessage(data, () => {
				console.log('NEW MSG');
			});

			this.chat.addOne(data);

			this.chat.render();
			this.form.reset();
		});
	}

	addMessage (data) {
		this.chat.addOne(data);
	}

}

//export
window.App = App;
