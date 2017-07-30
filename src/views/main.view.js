import BaseView from '../framework/view';

import Menu from '../components/menu/menu';

import firebaseService from '../services/firebase.service';

/**
 * @class MainView
 */
export default class MainView extends BaseView {
	render () {
		this.menu.render();
		this.el.append(this.menu.el);
	}

	_createComponents () {
		this.menu = new Menu({
			el: document.createElement('div'),
			data: {
				title: 'Single Page Chat',
				items: [
					{href: '/login', text: 'Sign in'},
					{href: '/chat', text: 'Chat'},
					{href: '/settings', text: 'Settings'},
				]
			}
		});
	}

	show() {
		const currentUser = firebaseService.auth().currentUser;
		if (!currentUser) {
			this.menu.setData({
				title: 'Single Page Chat',
				items: [
					{href: '/login', text: 'Sign in'},
				]
			});
		} else {
			this.menu.setData({
				title: 'Single Page Chat',
				items: [
					{href: '/chat', text: 'Chat'},
					{href: '/settings', text: 'Settings'},
				]
			});
		}
		this.render();
		super.show();
	}
}
