import {BaseView} from '../framework/view';

import {Form} from '../components/form/form';
import {Menu} from '../components/menu/menu';

import {ChatService} from '../services/chat.service';

export class LoginView extends BaseView {
    constructor (...rest) {
        super(...rest);

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

        this.el.appendChild(this.menu.el);
        this.el.appendChild(this.form.el);
        
        this.form.render();
        this.menu.render();

        this.form.on('submit', formData => {
            let chatService = ChatService.getInstance();

            chatService.setUserName(formData.username.value);
            this.router.go('/chat');
        });
    }
}