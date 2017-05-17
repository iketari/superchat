import {BaseView} from '../framework/view';

import {Chat} from '../components/chat/chat';
import {Form} from '../components/form/form';
import {AvatarService} from '../services/avatar.service';
import {ChatService} from '../services/chat.service';
import {HttpService} from '../services/http.service';


const chatService = ChatService.getInstance({
	baseUrl: 'https://components-e2e6e.firebaseio.com/chat/messages/iketari.json',
	http: HttpService.getInstance(),
	pollingInterval: 1000
});

const avatarService = AvatarService.getInstance();

export class ChatView extends BaseView {
    constructor (...rest) {
        super(...rest);

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
                            type: 'submit',
                            value: 'Отправить'
                        }
                    },
                    {
                        tag: 'a',
                        inner: 'Выйти',
                        attributes: {
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
				text: formData.message.value
			};

			chatService.sendMessage(data);
			this.chat.addOne(data);

			this.render();
		});

		chatService.startPolling();
	}

	addMessage (data) {
		this.chat.addOne(data);
	}

}
