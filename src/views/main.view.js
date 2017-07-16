import BaseView from '../framework/view';

import Menu from '../components/menu/menu';

export default class MainView extends BaseView {
	constructor (...rest) {
		super(...rest);
	}

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
					{href: '/login', text: 'Войти'},
					{href: '/chat', text: 'Чат'},
				]
			}
		});
	}
}
