import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';

import ChatService from '../services/chat.service';
import firebaseService from '../services/firebase.service';

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
							placeholder: 'Введите имя пользователя'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'password',
							name: 'password',
							placeholder: 'Введите пароль'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'submit',
							name: 'action',
							value: 'Войти'
						}
					}
				]
			}
		});
	}

	_initMediate () {
		this.form.on('submit', formData => {
			firebaseService.auth()
				.signInWithEmailAndPassword(formData.username, formData.password)
				.catch(function(error) {
					// Handle Errors here.
					const errorCode = error.code;
					const errorMessage = error.message;

					console.log(errorCode, errorMessage);
				});
		});

		firebaseService.auth().onAuthStateChanged((user) => {
			if (user) {
				let chatService = ChatService.getInstance();
				chatService.setUserName(user.email);
				this.router.go('/chat');
			} else {
				this.router.go('/login');
			}
		});
	}
}