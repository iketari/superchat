import BaseView from '../framework/view';

import Form from '../components/form/form';
import Menu from '../components/menu/menu';

import ChatService from '../services/chat.service';
import firebaseService from '../services/firebase.service';


/**
 * @class LoginView
 */
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
			fields: ['username', 'password', 'new'],
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
			if (formData.new) {
				this._signUp(formData);
			} else {
				this._signIn(formData);
			}
		});
	}

	_signIn (formData) {
		firebaseService.signIn(formData.username, formData.password);
	}

	_signUp (formData) {
		firebaseService.signUp(formData.username, formData.password);
	}
}
