import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';

import ChatService from '../services/chat.service';

export default class LoginView extends BaseView {
	constructor (...rest) {
		super(...rest);
	}

	render () {
		this.form.render();
		this.menu.render();

		this.el.append(this.menu.el);
		this.el.append(this.form.el);
	}

	_createComponents () {
		this.menu = new Menu({
			el: document.createElement('div'),
			data: {
				title: 'Авторизация',
				items: []
			}
		});

		this.form = new Form({
			el: document.createElement('div'),
			data: {
				widgets: [
					{   
						tag: 'input',
						attributes: {
							type: 'text',
							name: 'username',
							placeholder: 'Имя пользователя...'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'submit',
							value: 'Войти'
						}
					}
				]
			}
		});
	}

	_initMediate () {
		this.form.on('submit', formData => {
			let chatService = ChatService.getInstance();

			chatService.setUserName(formData.username.value);
			this.router.go('/chat');
		});
	}
}