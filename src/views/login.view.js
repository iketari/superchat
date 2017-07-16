import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';

import ChatService from '../services/chat.service';
import firebaseService from '../services/firebase.service';


export default class LoginView extends BaseView {
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
				title: 'Sign in',
				items: [],
				home: true,
			}
		});

		this.form = new Form({
			el: document.createElement('div'),
			data: {
				widgets: [
					{
						tag: 'input',
						attributes: {
							type: 'email',
							name: 'username',
							id: 'user_username',
							placeholder: 'Enter your email address',
						},
						label: {
							inner: 'Username'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'password',
							name: 'password',
							id: 'user_password',
							placeholder: 'Enter your password'
						},
						label: {
							inner: 'Password'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'checkbox',
							name: 'new',
							id: 'new_user',
						},
						label: {
							inner: 'New user'
						}
					},
					{
						tag: 'input',
						attributes: {
							type: 'submit',
							name: 'action',
							value: 'Sign in'
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
				.catch(function (error) {
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

				firebaseService.auth().currentUser.getToken(/* forceRefresh */ true)
					.then(function (idToken) {
						console.log(idToken);
						sessionStorage.setItem('token', idToken);
					})
					.catch(function (error) {
						// Handle error
					});


				this.router.go('/chat');
			} else {
				this.router.go('/main');
			}
		});
	}
}
