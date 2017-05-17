import './app.css';

import {Chat} from '../chat/chat';
import {Form} from '../form/form';
import {AvatarService} from '../../services/avatar.service';
import {ChatService} from '../../services/chat.service';
import {WindowService} from '../../services/window.service';
import {HttpService} from '../../services/http.service';


const chatService = ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: HttpService.getInstance()
});

const windowService = WindowService.getInstance({document});

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
			avatarService: AvatarService.getInstance(),
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
		windowService.onVisibilityChange(status => {
			console.log(status);
		});

		this.form.on('message', (event) => {
			let data = event.detail;
			let userName = event.detail.username.value;

			if (userName) {
				this.chat.setUserName(userName);
				this.form.setUserName(userName);
			}

			data = {
				text: data.message.value,
				name: this.chat.getUsername()
			};

			chatService.sendMessage(data, () => {
				console.log('NEW MSG');
			});

			this.chat.addOne(data);

			this.render();
		});
	}

	addMessage (data) {
		this.chat.addOne(data);
	}

}

//export
window.App = App;
