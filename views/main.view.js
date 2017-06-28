import BaseView from '../framework/view';

import Menu from '../components/menu/menu';

export default class MainView extends BaseView {
    constructor (...rest) {
        super(...rest);

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

        this.el.appendChild(this.menu.el);
        this.menu.render();
    }
}